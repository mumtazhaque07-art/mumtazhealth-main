-- Update the status check constraint on bookings table to allow 'waitlisted'
-- We must first drop the existing check constraint if it exists, but Supabase standard check constraints might be implicit in our initial migration or it might just be text without a check constraint.
-- Looking at the initial migration, status is just `TEXT NOT NULL DEFAULT 'pending'`, there was no check constraint, just a comment: `-- 'pending', 'confirmed', 'cancelled', 'completed'`

-- Add upcoming_dates JSONB column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS upcoming_dates JSONB DEFAULT '[]'::jsonb;

-- Add a comment for documentation
COMMENT ON COLUMN services.upcoming_dates IS 'Array of objects: [{"date": "ISO8601", "capacity": 20, "booked": 0}]';
