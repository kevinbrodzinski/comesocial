
-- Fix security warnings by updating all functions to include SET search_path

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$function$;

-- Update get_user_plan_role function
CREATE OR REPLACE FUNCTION public.get_user_plan_role(plan_id integer, user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.plan_participants 
  WHERE plan_id = $1 AND user_id = $2
  LIMIT 1;
$function$;

-- Update can_user_access_plan function
CREATE OR REPLACE FUNCTION public.can_user_access_plan(plan_id integer, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.plans p 
    WHERE p.id = $1 AND (
      p.creator_id = $2 OR 
      EXISTS (SELECT 1 FROM public.plan_participants pp WHERE pp.plan_id = $1 AND pp.user_id = $2)
    )
  );
$function$;

-- Update update_user_presence function
CREATE OR REPLACE FUNCTION public.update_user_presence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_presence (user_id, status, last_seen, updated_at)
  VALUES (auth.uid(), 'online', now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    status = 'online',
    last_seen = now(),
    updated_at = now();
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update cleanup_expired_notifications function
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$function$;

-- Update cleanup_expired_vibes function
CREATE OR REPLACE FUNCTION public.cleanup_expired_vibes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.user_vibes 
  SET is_active = false 
  WHERE expires_at IS NOT NULL AND expires_at < now() AND is_active = true;
END;
$function$;

-- Update is_plan_creator function
CREATE OR REPLACE FUNCTION public.is_plan_creator(plan_id integer, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.plans p 
    WHERE p.id = $1 AND p.creator_id = $2
  );
$function$;

-- Update can_user_access_draft function
CREATE OR REPLACE FUNCTION public.can_user_access_draft(draft_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.co_planning_drafts d 
    WHERE d.id = $1 AND (
      d.creator_id = $2 OR 
      EXISTS (SELECT 1 FROM public.co_planning_participants cp WHERE cp.draft_id = $1 AND cp.user_id = $2)
    )
  );
$function$;

-- Update is_draft_creator function
CREATE OR REPLACE FUNCTION public.is_draft_creator(draft_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.co_planning_drafts d 
    WHERE d.id = $1 AND d.creator_id = $2
  );
$function$;
