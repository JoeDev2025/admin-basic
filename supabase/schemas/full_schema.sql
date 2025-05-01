-- You can run this entire file in the Supabase SQL editor to create the schema and tables.
-- This SQL file creates the necessary tables and policies for a media upload system with user authentication and admin roles.


 --------- MAIN TABLES AND  PERMISSIONS -----------

-- Create the media_uploads table
CREATE TABLE media_uploads (
    media_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    original_filename text NOT NULL,
    status text NOT NULL CHECK (status IN ('uploaded', 'failed', 'pending')),
    count_id integer GENERATED ALWAYS AS IDENTITY,
    random_number integer DEFAULT (floor(random() * 900 + 100)::int),
    file_name text,
    file_type text,
    file_size integer,
    storage_path text,
    created_at timestamp DEFAULT now(),
    thumbnail_path text,
    used_elsewhere text,
    description text
);

-- Enable Row-Level Security (RLS) for the table
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to access only their own files
CREATE POLICY "Allow users to access their own files"
ON media_uploads
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
 
 --------- BUCKETS -----------

-- Create public bucket for media_uploads_bucket
insert into storage.buckets (id, name, public)
values ('media_uploads_bucket', 'media_uploads_bucket', false)
on conflict (id) do nothing;

-- Make the bucket public
update storage.buckets
set public = true
where id = 'media_uploads_bucket';


 --------- ADMIN/AUTH PERMISSIONS ETC -----------

 CREATE TABLE admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_role text DEFAULT 'standard', -- Role column with default value set to "standard" user
		profile_image_url text,
		profile_image_thumbnail_url text, 
		author_summary text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow users and system to access their own data
CREATE POLICY "Allow users to access their own data"
ON admin_users
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own data
CREATE POLICY "Allow users to update their own data"
ON admin_users
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a view to expose the admin data to the admin users (allows context providers to work)
CREATE VIEW user_admin_view AS
SELECT user_id, admin_role, profile_image_url, profile_image_thumbnail_url, author_summary
FROM admin_users
WHERE user_id = auth.uid();

-- Restrict Direct Access to the View 
REVOKE ALL ON user_admin_view FROM PUBLIC;
GRANT SELECT ON user_admin_view TO authenticated; 


-- Securing other tables so only admin users can access them
-- create policy "Only admins can manage data on sensitive table"
--   on some_sensitive_table
--   for all using (
--     exists (
--       select 1 from admin_users where user_id = auth.uid() WHERE admin_role = 'super_admin' -- or 'admin' or 'standard'
--     )
--   );



