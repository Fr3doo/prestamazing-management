
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partners_logos table
CREATE TABLE public.partners_logos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_info table
CREATE TABLE public.contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'email', 'phone', 'address', 'hours', etc.
    value TEXT NOT NULL,
    label TEXT, -- ex: 'Support', 'Siège'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create content_sections table (optional)
CREATE TABLE public.content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE, -- 'hero_title', 'about_text', etc.
    title TEXT,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Create RLS policies for user_roles (admins can manage all roles)
CREATE POLICY "Admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert user roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update user roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage reviews"
  ON public.reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for partners_logos
CREATE POLICY "Anyone can view partners logos"
  ON public.partners_logos
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage partners logos"
  ON public.partners_logos
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for contact_info
CREATE POLICY "Anyone can view contact info"
  ON public.contact_info
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage contact info"
  ON public.contact_info
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for content_sections
CREATE POLICY "Anyone can view content sections"
  ON public.content_sections
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage content sections"
  ON public.content_sections
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('partners-logos', 'partners-logos', true);

-- Create storage policies for partners-logos bucket
CREATE POLICY "Anyone can view partner logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'partners-logos');

CREATE POLICY "Admins can upload partner logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'partners-logos' 
    AND public.is_admin(auth.uid())
    AND (storage.foldername(name))[1] = 'partners'
  );

CREATE POLICY "Admins can update partner logos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'partners-logos' 
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete partner logos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'partners-logos' 
    AND public.is_admin(auth.uid())
  );

-- Create storage bucket for general content images
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true);

-- Create storage policies for content-images bucket
CREATE POLICY "Anyone can view content images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'content-images');

CREATE POLICY "Admins can manage content images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'content-images' 
    AND public.is_admin(auth.uid())
  );

-- Insert some default contact info
INSERT INTO public.contact_info (type, value, label) VALUES
('phone', '+33 6 00 00 00 00', 'Téléphone principal'),
('email', 'contact@stevepresta.com', 'Email principal'),
('address', 'Paris et région parisienne', 'Zone d''intervention'),
('hours', 'Lundi - Vendredi: 9h00 - 19h00', 'Heures de disponibilité');

-- Insert some default content sections
INSERT INTO public.content_sections (section_key, title, content) VALUES
('hero_title', 'Expert en management de la restauration', 'Passionné par l''excellence du service et l''optimisation de l''expérience client.'),
('about_intro', 'Mon histoire', 'Avec plus de 15 années d''expérience dans l''industrie de la restauration haut de gamme...');
