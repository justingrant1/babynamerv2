-- Migration: Add rating and is_winner columns to list_names table
-- Run this in your Supabase SQL Editor

-- Add rating column
ALTER TABLE public.list_names 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 0 AND rating <= 5) DEFAULT 0;

-- Add is_winner column
ALTER TABLE public.list_names 
ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT FALSE;

-- Update the RLS policy to allow updates (if it doesn't exist)
DROP POLICY IF EXISTS "Editors can update names in lists" ON public.list_names;
CREATE POLICY "Editors can update names in lists" ON public.list_names
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.list_members
      WHERE list_id = list_names.list_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'editor')
    )
  );
