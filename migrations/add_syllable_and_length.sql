-- ============================================
-- Phase 2: Add Syllable Count and Name Length
-- ============================================

-- Add syllable_count and name_length columns to names table
ALTER TABLE public.names 
ADD COLUMN IF NOT EXISTS syllable_count INTEGER,
ADD COLUMN IF NOT EXISTS name_length INTEGER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_names_syllable_count ON public.names(syllable_count);
CREATE INDEX IF NOT EXISTS idx_names_name_length ON public.names(name_length);

-- Function to count syllables (basic approximation)
-- Counts vowel groups as syllables
CREATE OR REPLACE FUNCTION count_syllables(name_text TEXT) 
RETURNS INTEGER AS $$
DECLARE
  syllable_count INTEGER := 0;
  prev_is_vowel BOOLEAN := FALSE;
  current_char TEXT;
  i INTEGER;
BEGIN
  -- Convert to lowercase for easier processing
  name_text := LOWER(name_text);
  
  -- Count vowel groups
  FOR i IN 1..LENGTH(name_text) LOOP
    current_char := SUBSTRING(name_text FROM i FOR 1);
    
    IF current_char IN ('a', 'e', 'i', 'o', 'u', 'y') THEN
      IF NOT prev_is_vowel THEN
        syllable_count := syllable_count + 1;
      END IF;
      prev_is_vowel := TRUE;
    ELSE
      prev_is_vowel := FALSE;
    END IF;
  END LOOP;
  
  -- Adjust for silent 'e' at end
  IF LENGTH(name_text) > 2 AND SUBSTRING(name_text FROM LENGTH(name_text)) = 'e' THEN
    IF syllable_count > 1 THEN
      syllable_count := syllable_count - 1;
    END IF;
  END IF;
  
  -- Ensure at least 1 syllable
  IF syllable_count = 0 THEN
    syllable_count := 1;
  END IF;
  
  RETURN syllable_count;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing names with syllable count and length
UPDATE public.names 
SET 
  syllable_count = count_syllables(name),
  name_length = LENGTH(name)
WHERE syllable_count IS NULL OR name_length IS NULL;

-- Create trigger to auto-populate syllable_count and name_length on insert
CREATE OR REPLACE FUNCTION auto_populate_name_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.syllable_count := count_syllables(NEW.name);
  NEW.name_length := LENGTH(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS populate_name_stats ON public.names;
CREATE TRIGGER populate_name_stats
  BEFORE INSERT OR UPDATE OF name ON public.names
  FOR EACH ROW
  EXECUTE FUNCTION auto_populate_name_stats();

-- Add comments for documentation
COMMENT ON COLUMN public.names.syllable_count IS 'Number of syllables in the name (auto-calculated)';
COMMENT ON COLUMN public.names.name_length IS 'Length of the name in characters (auto-calculated)';
