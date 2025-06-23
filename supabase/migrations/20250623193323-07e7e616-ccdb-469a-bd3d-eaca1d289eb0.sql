
-- Update the is_admin function without dropping it (just replace the implementation)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$function$;

-- Fix the other functions by updating them without dropping
CREATE OR REPLACE FUNCTION public.update_user_profile(_user_id uuid, _username text, _email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    UPDATE public.profiles SET username = _username, email = _email WHERE id = _user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id uuid)
RETURNS TABLE(id uuid, username text, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY SELECT profiles.id, profiles.username, profiles.email FROM public.profiles WHERE profiles.id = _user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY SELECT user_roles.role::text FROM public.user_roles WHERE user_roles.user_id = _user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_user_existence(_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    exists_user boolean;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = _email) INTO exists_user;
    RETURN exists_user;
END;
$function$;

-- Remove only the problematic overloaded functions that don't have dependencies
DROP FUNCTION IF EXISTS public.get_user_profile();
DROP FUNCTION IF EXISTS public.update_user_profile(bigint, jsonb);
DROP FUNCTION IF EXISTS public.count_users();

-- Configure Auth settings to address the warnings
INSERT INTO public.otp_settings (otp_email_expiry, otp_sms_expiry)
VALUES (3600, 600)  -- 1 hour for email, 10 minutes for SMS
ON CONFLICT (id) DO UPDATE SET
  otp_email_expiry = 3600,
  otp_sms_expiry = 600;
