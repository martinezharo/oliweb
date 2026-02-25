-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    url TEXT,
    logo_url TEXT,
    short_description_es TEXT,
    short_description_en TEXT,
    history_es TEXT,
    history_en TEXT
);

-- Create posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content_es TEXT NOT NULL,
    content_en TEXT NOT NULL,
    image_urls TEXT[] -- Array of image URLs
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE CONTROL;
ALTER TABLE posts ENABLE CONTROL;

-- Create policies for public read access
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);
