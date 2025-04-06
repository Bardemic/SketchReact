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