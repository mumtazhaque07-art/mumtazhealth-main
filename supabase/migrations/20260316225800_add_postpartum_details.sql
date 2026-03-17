-- Add postpartum_delivery_type to user_wellness_profiles
ALTER TABLE "public"."user_wellness_profiles" 
ADD COLUMN IF NOT EXISTS "postpartum_delivery_type" text CHECK (postpartum_delivery_type IN ('natural', 'cesarean'));

COMMENT ON COLUMN "public"."user_wellness_profiles"."postpartum_delivery_type" IS 'Type of delivery for postpartum users (natural or cesarean) for specialized recovery guidance.';
