-- COMBINED SUPABASE CONFIGURATION SCRIPT
-- This script combines user management and sketches functionality

-------------------------------------------------------
-- PART 1: USER MANAGEMENT (from supabaseconfig.sql)
-------------------------------------------------------

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view and edit their own data
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-------------------------------------------------------
-- PART 2: SKETCHES FUNCTIONALITY (from sketches.sql)
-------------------------------------------------------

-- Create sketches table
CREATE TABLE IF NOT EXISTS public.sketches (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Sketch',
  whiteboard JSONB,
  page_result TEXT,
  last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.sketches ENABLE ROW LEVEL SECURITY;

-- Create policies for sketch access
CREATE POLICY "Users can view their own sketches" ON public.sketches
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sketches" ON public.sketches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sketches" ON public.sketches
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sketches" ON public.sketches
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster user-based queries
CREATE INDEX IF NOT EXISTS sketches_user_id_idx ON public.sketches(user_id); 