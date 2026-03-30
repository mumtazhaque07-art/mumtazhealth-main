-- Sprint 6: Row Level Security Hardening
-- This script safely enables RLS and creates policies ensuring users can only read/write their own data.

-- 1. bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookings"
ON public.bookings FOR ALL USING (auth.uid() = user_id);

-- 2. condition_symptom_tracking
ALTER TABLE public.condition_symptom_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own condition/symptom tracking"
ON public.condition_symptom_tracking FOR ALL USING (auth.uid() = user_id);

-- 3. daily_practice_reminders
ALTER TABLE public.daily_practice_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reminders"
ON public.daily_practice_reminders FOR ALL USING (auth.uid() = user_id);

-- 4. daily_recommendations
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily recommendations"
ON public.daily_recommendations FOR ALL USING (auth.uid() = user_id);

-- 5. notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- 6. profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all profiles but update their own"
ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 7. quick_checkin_logs
ALTER TABLE public.quick_checkin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own quick check-in logs"
ON public.quick_checkin_logs FOR ALL USING (auth.uid() = user_id);

-- 8. saved_practices
ALTER TABLE public.saved_practices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved practices"
ON public.saved_practices FOR ALL USING (auth.uid() = user_id);

-- 9. support_plan_logs
ALTER TABLE public.support_plan_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own support plan logs"
ON public.support_plan_logs FOR ALL USING (auth.uid() = user_id);

-- 10. user_content_progress
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own content progress"
ON public.user_content_progress FOR ALL USING (auth.uid() = user_id);

-- 11. user_favorite_feelings
ALTER TABLE public.user_favorite_feelings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own favorite feelings"
ON public.user_favorite_feelings FOR ALL USING (auth.uid() = user_id);

-- 12. user_saved_content
ALTER TABLE public.user_saved_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own saved content"
ON public.user_saved_content FOR ALL USING (auth.uid() = user_id);

-- 13. user_wellness_profiles
ALTER TABLE public.user_wellness_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wellness profiles"
ON public.user_wellness_profiles FOR ALL USING (auth.uid() = user_id);

-- 14. wellness_effectiveness
ALTER TABLE public.wellness_effectiveness ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wellness effectiveness data"
ON public.wellness_effectiveness FOR ALL USING (auth.uid() = user_id);

-- 15. wellness_entries
ALTER TABLE public.wellness_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wellness entries"
ON public.wellness_entries FOR ALL USING (auth.uid() = user_id);
