 --------- MAIN TABLES AND  PERMISSIONS -----------

-- Create the reminders table
CREATE TABLE reminders (
    reminder_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text,
    description text NOT NULL,  
    created_at timestamp DEFAULT now()
);

-- Enable Row-Level Security (RLS) for the table
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to access only their own reminders
CREATE POLICY "Allow users to access their own reminders"
ON reminders
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
