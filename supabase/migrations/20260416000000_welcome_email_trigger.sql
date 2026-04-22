-- Enable pg_net for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER AS $$
DECLARE
  project_url TEXT;
  service_role_key TEXT;
  request_body JSONB;
BEGIN
  -- You must set these using supabase secrets or replace them manually for production
  -- To make it easy, you can temporarily hardcode your Supabase URL here.
  -- Example: project_url := 'https://xyz.supabase.co/functions/v1/send-welcome-email';
  -- For local development with Supabase CLI:
  project_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-welcome-email';
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- Fallback for local docker networks if settings not found
  IF project_url IS NULL OR project_url = '/functions/v1/send-welcome-email' THEN
     project_url := 'http://supabase_kong:8000/functions/v1/send-welcome-email';
  END IF;

  request_body := json_build_object(
    'userEmail', NEW.email,
    'userName', COALESCE(NEW.raw_user_meta_data->>'username', '')
  );

  PERFORM net.http_post(
    url := project_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_role_key, 'ANON_KEY_PLACEHOLDER')
    ),
    body := request_body
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Silently catch errors so the user signup doesn't completely roll back if the email fails
    RAISE LOG 'Error sending welcome email webhook: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_welcome ON auth.users;

CREATE TRIGGER on_auth_user_created_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_welcome();
