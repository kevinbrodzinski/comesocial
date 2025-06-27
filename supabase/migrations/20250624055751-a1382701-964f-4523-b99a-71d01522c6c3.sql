
-- Add context column to message_threads table for map message center functionality
ALTER TABLE public.message_threads 
ADD COLUMN IF NOT EXISTS context TEXT DEFAULT 'direct' CHECK (context IN ('direct', 'plan', 'map'));

-- Add index on context column for performance
CREATE INDEX IF NOT EXISTS idx_message_threads_context ON public.message_threads(context);

-- Update existing threads to have proper context based on their type
UPDATE public.message_threads 
SET context = CASE 
    WHEN plan_id IS NOT NULL THEN 'plan'
    WHEN thread_type = 'group' OR thread_type = 'map-group' THEN 'map'
    ELSE 'direct'
END
WHERE context = 'direct';
