# Supabase Setup for Wardrobe Feature

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy your Project URL and Anon Key
4. Add them to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 2: Run This SQL in Supabase SQL Editor

```sql
-- Create wardrobe_items table
CREATE TABLE wardrobe_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  item_description TEXT NOT NULL,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX wardrobe_items_user_id_idx ON wardrobe_items(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for select
CREATE POLICY "Users can view their own items" ON wardrobe_items
  FOR SELECT USING (auth.uid()::text = user_id);

-- Create RLS policy for insert
CREATE POLICY "Users can insert their own items" ON wardrobe_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create RLS policy for delete
CREATE POLICY "Users can delete their own items" ON wardrobe_items
  FOR DELETE USING (auth.uid()::text = user_id);
```

## Step 3: Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `wardrobe-items`
3. Set it to Public
4. Create an RLS policy:
   - Select the `wardrobe-items` bucket
   - Add policy: Allow authenticated users to upload/delete their own files
   ```sql
   CREATE POLICY "Users can upload wardrobe items" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'wardrobe-items');
   
   CREATE POLICY "Users can delete wardrobe items" ON storage.objects
     FOR DELETE USING (bucket_id = 'wardrobe-items');
   ```

## Step 4: Add Environment Variables

Add to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 5: Test

1. Go to http://localhost:3000/wardrobe
2. Sign in with your Clerk account
3. Upload a clothing item
4. View your wardrobe
5. Generate outfit recommendations
