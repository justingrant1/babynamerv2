# Database Setup Instructions

## Important: You need to run the database schema before the app will work!

### Step 1: Run the SQL Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `vsdefirkmxragppibsoa`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql` file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

This will create all the necessary tables, functions, triggers, and Row Level Security policies.

### Step 2: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `names`
   - `user_seen_names`
   - `shortlist`
   - `lists`
   - `list_members`
   - `list_names`

### Step 3: Configure Supabase Auth (Optional but Recommended)

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`

### Step 4: Start the Development Server

```bash
npm run dev
```

Your app should now be running at http://localhost:3000

## Troubleshooting

### "relation 'public.profiles' does not exist"
- Make sure you ran the SQL schema from Step 1
- Check the SQL Editor for any errors

### Authentication issues
- Verify your environment variables in `.env.local`
- Check that the Supabase URL and anon key are correct
- Make sure you configured the redirect URLs in Supabase settings

### Can't sign up
- Check your email - Supabase sends a confirmation email
- In development, you can disable email confirmation:
  - Go to Authentication > Settings
  - Turn off "Enable email confirmations"
