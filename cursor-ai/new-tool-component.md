# Cursor AI instructions for creating a new tool

Before we can make it we need to know the following

1. Name of the tool for example "Story Maker"
2. Description of the tool for example "A tool to add stories for a children's book"

## What the tool should be able to do

A user should be able to add and edit a story, each story should have a title, a short description, some rich text content, and a list of images and or videos. The images and videos can make use of our website media_uploads tool to upload and store the media and simply mark them as used_elsewhere = 'story_book' in the databases column "used_elsewhere". 

We will need a separate table to be able to store the medias positioning and relation to each story, and a table for the stories themselves.

Each story should also have a visibility setting, so that it can be set to public or draft, and a publish date. The publish date should be set to the current date when the story is created, but can be changed to a future date if needed.

Place our database schema file in supabase\schemas\stories_tables.sql

### Copying blank template files

We can use the following 2 files to copy and modify for our new tool:

- src\app\blank-page\page.tsx
- src\components\BlankComponent\BlankComponent.tsx

We are on windows so cannot use && in our CLI commands

Make sure you keep the structure of the template files and only change values and names to match the new tool.

### Notes about creating the database

I will need to manually add the database tables to supabase, we should enable RLS for the new tables, and wmake sure our admin uses can edit them using something like this: 

```sql
create policy "Only admins can manage data the stories"
  on our_stories_table
  for all using (
    exists (
      select 1 from admin_users where user_id = auth.uid() WHERE (admin_role = 'super_admin' OR admin_role = 'admin') 
    )
  );
```

The tables should be publicly visible when the story is set to public
