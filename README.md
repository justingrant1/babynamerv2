# AI Baby Namer

A full-stack Next.js application that uses AI to help parents find the perfect baby name. Built with Next.js 14, Supabase, OpenAI, and Stripe.

## 🎯 Features

### ✅ Completed Features

#### Free Tier
- **AI-Powered Name Generation**: Generate 5 unique baby names per request (3 generations/day limit)
- **Smart Filtering**: Filter by gender, characteristics, origin, and letter patterns
- **Trending Names**: View the most popular names globally
- **No Duplicates**: Never see the same name twice

#### Premium Tier ($3.99/month)
- **Unlimited Generations**: Generate as many names as you want
- **Shortlist Feature**: Save your favorite names to a shortlist
- **Full Name Details**: See origin, meaning, and characteristics for each name
- **Priority Support**: Get help when you need it

### 🚧 Coming Soon
- **Lists Feature**: Create multiple lists for different themes
- **Collaboration**: Share lists with friends and family
- **List Invites**: Invite others to collaborate on your lists

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- OpenAI API key
- Stripe account

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd aibabynamer
npm install
```

### 2. Set Up Supabase Database

**IMPORTANT**: You must run the database schema before the app will work!

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql`
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This will create:
- 7 database tables (profiles, names, user_seen_names, shortlist, lists, list_members, list_names)
- All necessary triggers and functions
- Row Level Security (RLS) policies

### 3. Configure Environment Variables

The `.env.local` file is already configured with your credentials:
- ✅ Supabase URL and keys
- ✅ OpenAI API key
- ✅ Stripe keys
- ✅ Stripe Price ID

### 4. Configure Supabase Auth (Optional but Recommended)

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`

### 5. Set Up Stripe Webhook (For Production)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret and update `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
aibabynamer/
├── app/
│   ├── api/
│   │   ├── generate-names/    # AI name generation endpoint
│   │   └── stripe/
│   │       ├── create-checkout/  # Stripe checkout session
│   │       └── webhook/          # Stripe webhooks handler
│   ├── auth/
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── callback/           # Auth callback
│   ├── pricing/                # Pricing page
│   └── page.tsx                # Homepage
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   ├── CharacteristicSelector.tsx  # Name filter form
│   ├── AIGeneratedNames.tsx    # Generated names display
│   ├── NameList.tsx            # Reusable name list
│   └── AdPlaceholder.tsx       # Ad placeholder
├── lib/
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth provider
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase
│   │   └── server.ts           # Server-side Supabase
│   └── types/
│       └── database.ts         # TypeScript types
├── supabase-schema.sql         # Database schema
└── .env.local                  # Environment variables
```

## 🔐 Database Schema

### Tables

1. **profiles** - User profiles (extends auth.users)
2. **names** - Global name repository
3. **user_seen_names** - Tracks which names each user has viewed
4. **shortlist** - Premium: User's favorite names
5. **lists** - Premium: Custom name lists
6. **list_members** - Premium: List collaborators
7. **list_names** - Premium: Names in lists

### Key Features

- **Row Level Security (RLS)**: All tables protected
- **Triggers**: Auto-create profiles, update timestamps, track popularity
- **Generation Limits**: Automatically reset daily
- **No Duplicates**: Users never see the same name twice

## 💳 Stripe Products

- **Product ID**: `prod_TWPH2Wvi4hYfyt`
- **Price ID**: `price_1SZMTNDvASIwBmR1dtMgP1VX`
- **Amount**: $3.99/month
- **Type**: Recurring subscription

## 🎨 Design Highlights

- Clean, modern UI with Tailwind CSS
- Responsive design (mobile-friendly)
- Toast notifications for user feedback
- Loading states for async operations
- Premium badge for subscribed users

## 🔑 Key Flows

### Name Generation Flow
1. User selects characteristics (gender, origin, style, etc.)
2. API checks user's generation limit
3. OpenAI generates 5 unique names
4. Names stored in database
5. Marked as "seen" for that user
6. Generation count incremented

### Premium Upgrade Flow
1. User clicks "Upgrade to Premium"
2. Stripe customer created (or retrieved)
3. Redirect to Stripe Checkout
4. User completes payment
5. Webhook updates user to premium
6. User gets access to shortlist & unlimited generations

### Shortlist Flow (Premium Only)
1. User clicks heart icon on a name
2. Name added to shortlist in database
3. Popularity score incremented
4. Shortlist updates in real-time

## 🐛 Troubleshooting

### "relation 'public.profiles' does not exist"
→ Make sure you ran `supabase-schema.sql` in the Supabase SQL Editor

### Authentication not working
→ Check that redirect URLs are configured in Supabase Auth settings

### Stripe webhook failing
→ Make sure webhook secret is correct in `.env.local`

### Name generation failing
→ Check OpenAI API key and account has credits

## 📝 Environment Variables

All environment variables are already configured in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vsdefirkmxragppibsoa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Supabase Production

1. Update redirect URLs for production domain
2. Enable RLS on all tables (already done)
3. Configure email templates in Supabase Auth

### Stripe Production

1. Switch to live API keys
2. Update webhook endpoint to production URL
3. Test payment flow thoroughly

## 📞 Support

For issues or questions:
- Check `DATABASE_SETUP.md` for database setup help
- Review error messages in browser console
- Check server logs in terminal

## 🎉 What's Working

✅ User authentication (signup/login)
✅ AI name generation with OpenAI
✅ Generation limits (3/day for free users)
✅ No duplicate names per user
✅ Trending names display
✅ Premium subscription flow
✅ Stripe webhook handling
✅ Shortlist feature (Premium)
✅ Responsive design
✅ Toast notifications

## 🔜 Next Steps

- [ ] Implement Lists feature
- [ ] Add collaboration/sharing
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Name pronunciation guide
- [ ] Name popularity charts

---

Built with ❤️ using Next.js, Supabase, OpenAI, and Stripe
