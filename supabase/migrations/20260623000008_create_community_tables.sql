-- Create community_posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    theme TEXT NOT NULL CHECK (theme IN ('Vata Years of Wisdom', 'Pitta Years of Purpose', 'Kapha Years of Grounding')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
    support_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
-- Anyone can view approved posts
CREATE POLICY "Anyone can view approved posts"
    ON public.community_posts
    FOR SELECT
    USING (status = 'approved');

-- Authenticated users can insert posts (they default to 'approved' based on schema, but admin can flag/reject them)
CREATE POLICY "Authenticated users can insert posts"
    ON public.community_posts
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Users can view their own posts regardless of status
CREATE POLICY "Users can view own posts"
    ON public.community_posts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create community_support table to track hearts/support clicks to prevent duplicate clicks
CREATE TABLE IF NOT EXISTS public.community_support (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_support ENABLE ROW LEVEL SECURITY;

-- Policies for community_support
CREATE POLICY "Anyone can view support counts"
    ON public.community_support
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add support"
    ON public.community_support
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can remove their support"
    ON public.community_support
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to increment the support_count on the post when a support row is inserted
CREATE OR REPLACE FUNCTION increment_support_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts
  SET support_count = support_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_support_added
AFTER INSERT ON public.community_support
FOR EACH ROW
EXECUTE FUNCTION increment_support_count();

-- Create a function to decrement the support_count on the post when a support row is deleted
CREATE OR REPLACE FUNCTION decrement_support_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_posts
  SET support_count = support_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_support_removed
AFTER DELETE ON public.community_support
FOR EACH ROW
EXECUTE FUNCTION decrement_support_count();
