# Admin Barebones with Supabase

Admin site with media uploader & user management to get started with building any platform or app

## Quick Start

1. Clone this repo: https://github.com/Maake-It/admin-bb-sup 
1. Run `yarn install` to install the dependencies
1. Create a Supabase project
	* Project name can be anything
	* Remember to write down the password for the database, you will need it later
	* Select a region near you or your user base
	* All other options can be left as default
1. Copy the .env.example file, rename it to .env.local and add the data from the Supbase Dashboard
1. Open up the supabase\schemas\full_schema.sql file, copy the contents and run it in Supabase SQL Editor
1. Run `yarn dev` to start the development server
1. When visiting http://localhost:3000, you should see the admin site and it will pop up asking you to login, or create an account, click on "Create and Account"
1. Fill in the form with your email and password, and click "Sign Up"
1. Check your email for the confirm link, and click on it to confirm your email address

### Promoting yourself to Admin & Super Admin

This part is very clunky, but it works for now until more elegant solution is found. (Note signup triggers just don't seem to like it!!)

1. Step 1 - Run this SQL command to make yourself a super_admin user:
```sql
INSERT INTO admin_users (user_id, admin_role) VALUES (
	'YOUR_USER_ID',
	'super_admin' -- or 'admin' if you want to be a normal admin, or standard user if you want to be a more restricted admin user
);
```
1. Step 2 - Now when you view http://localhost:3000/ - you should see yourself in the customers list - press "promote to admin" and refresh the page. 

#### Notes about admin users

First the auth.users table has app_metadata?.user_type set to 'admin' 

```ts
if (session?.user?.app_metadata?.user_type !== 'admin') {
  router.push('/not-authorized');
}
```

Secondly the admin_users table has a user_id and admin_role column. The user_id is the same as the auth.users.id column. The admin_role can be either 'standard', 'admin' or 'super_admin'.

We can now anable RLS on our tables and do something like this to secure them to only allow admins to access them.

```sql
create policy "Only admins can manage data on sensitive table"
  on some_sensitive_table
  for all using (
    exists (
      select 1 from admin_users where user_id = auth.uid() WHERE admin_role = 'super_admin' -- or 'admin' or 'standard'
    )
  );
```

