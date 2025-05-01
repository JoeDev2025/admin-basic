-- 1. Enable RLS
CREATE TABLE todos (
  todo_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title          text NOT NULL,
  description    text,
  is_complete    boolean DEFAULT false,
  display_order  integer NOT NULL,
  is_important   boolean DEFAULT false,
  due_date       timestamp with time zone,
  tags           text[], -- optional tags like ['work', 'urgent']
  repeat_frequency text, -- e.g., 'daily', 'weekly'
  created_at     timestamp with time zone DEFAULT now(),
  updated_at     timestamp with time zone DEFAULT now()
);

-- 2. Create a trigger to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable Row-Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow all users to view all items
CREATE POLICY "Allow all users to view all todos"
  ON todos
  FOR SELECT
  USING (true);

-- 5. RLS Policy: Allow users to edit their own items
CREATE POLICY "Allow users to update their own todos"
  ON todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. RLS Policy: Allow users to delete their own items
CREATE POLICY "Allow users to delete their own todos"
  ON todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. RLS Policy: Allow users to insert their own todos
CREATE POLICY "Allow users to insert their own todos"
  ON todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);