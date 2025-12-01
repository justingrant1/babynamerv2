-- ============================================
-- AI Baby Namer Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'expired', NULL)),
  subscription_end_date TIMESTAMPTZ,
  generations_today INTEGER DEFAULT 0,
  last_generation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. NAMES TABLE (global name repository)
-- ============================================
CREATE TABLE IF NOT EXISTS public.names (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'unisex')) NOT NULL,
  origin TEXT,
  meaning TEXT,
  characteristics TEXT[],
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_names_name ON public.names(name);
CREATE INDEX IF NOT EXISTS idx_names_gender ON public.names(gender);
CREATE INDEX IF NOT EXISTS idx_names_popularity ON public.names(popularity_score DESC);

-- ============================================
-- 3. USER_SEEN_NAMES TABLE (track viewed names)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_seen_names (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name_id UUID NOT NULL REFERENCES public.names(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name_id)
);

CREATE INDEX IF NOT EXISTS idx_user_seen_names_user ON public.user_seen_names(user_id);
CREATE INDEX IF NOT EXISTS idx_user_seen_names_name ON public.user_seen_names(name_id);

-- ============================================
-- 4. SHORTLIST TABLE (premium feature)
-- ============================================
CREATE TABLE IF NOT EXISTS public.shortlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name_id UUID NOT NULL REFERENCES public.names(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name_id)
);

CREATE INDEX IF NOT EXISTS idx_shortlist_user ON public.shortlist(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_name ON public.shortlist(name_id);

-- ============================================
-- 5. LISTS TABLE (collaborative lists - premium)
-- ============================================
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  invite_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lists_owner ON public.lists(owner_id);
CREATE INDEX IF NOT EXISTS idx_lists_invite_code ON public.lists(invite_code);

-- ============================================
-- 6. LIST_MEMBERS TABLE (collaborators)
-- ============================================
CREATE TABLE IF NOT EXISTS public.list_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(list_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_members_list ON public.list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_list_members_user ON public.list_members(user_id);

-- ============================================
-- 7. LIST_NAMES TABLE (names in lists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.list_names (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  name_id UUID NOT NULL REFERENCES public.names(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(list_id, name_id)
);

CREATE INDEX IF NOT EXISTS idx_list_names_list ON public.list_names(list_id);
CREATE INDEX IF NOT EXISTS idx_list_names_name ON public.list_names(name_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS lists_updated_at ON public.lists;
CREATE TRIGGER lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to reset daily generation count
CREATE OR REPLACE FUNCTION public.reset_generation_count()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET generations_today = 0
  WHERE last_generation_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment popularity score when name added to shortlist/list
CREATE OR REPLACE FUNCTION public.increment_popularity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.names
  SET popularity_score = popularity_score + 1
  WHERE id = NEW.name_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for popularity
DROP TRIGGER IF EXISTS shortlist_popularity ON public.shortlist;
CREATE TRIGGER shortlist_popularity
  AFTER INSERT ON public.shortlist
  FOR EACH ROW EXECUTE FUNCTION public.increment_popularity();

DROP TRIGGER IF EXISTS list_names_popularity ON public.list_names;
CREATE TRIGGER list_names_popularity
  AFTER INSERT ON public.list_names
  FOR EACH ROW EXECUTE FUNCTION public.increment_popularity();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seen_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_names ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Names policies (public read)
CREATE POLICY "Names are viewable by everyone" ON public.names
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert names" ON public.names
  FOR INSERT WITH CHECK (true);

-- User seen names policies
CREATE POLICY "Users can view own seen names" ON public.user_seen_names
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own seen names" ON public.user_seen_names
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shortlist policies (premium only)
CREATE POLICY "Users can view own shortlist" ON public.shortlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Premium users can insert to shortlist" ON public.shortlist
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_premium = true)
  );

CREATE POLICY "Users can delete from own shortlist" ON public.shortlist
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own shortlist" ON public.shortlist
  FOR UPDATE USING (auth.uid() = user_id);

-- Lists policies
CREATE POLICY "Users can view own lists" ON public.lists
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.list_members WHERE list_id = id AND user_id = auth.uid())
  );

CREATE POLICY "Premium users can create lists" ON public.lists
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_premium = true)
  );

CREATE POLICY "Owners can update own lists" ON public.lists
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own lists" ON public.lists
  FOR DELETE USING (auth.uid() = owner_id);

-- List members policies
CREATE POLICY "Members can view list membership" ON public.list_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.lists WHERE id = list_id AND (owner_id = auth.uid() OR is_public = true)) OR
    user_id = auth.uid()
  );

CREATE POLICY "List owners can manage members" ON public.list_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.lists WHERE id = list_id AND owner_id = auth.uid())
  );

-- List names policies
CREATE POLICY "Members can view list names" ON public.list_names
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lists l
      LEFT JOIN public.list_members lm ON l.id = lm.list_id
      WHERE l.id = list_id AND (l.owner_id = auth.uid() OR lm.user_id = auth.uid())
    )
  );

CREATE POLICY "Editors can add names to lists" ON public.list_names
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.list_members
      WHERE list_id = list_names.list_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Editors can remove names from lists" ON public.list_names
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.list_members
      WHERE list_id = list_names.list_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
    )
  );

-- ============================================
-- INITIAL DATA SEED (Optional - Trending Names)
-- ============================================
-- You can add some initial popular names here if desired
