-- Drop existing tables if they exist
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS equipment_images CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Create Projects table
CREATE TABLE projects (
  id bigint primary key generated always as identity,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create Equipment table
CREATE TABLE equipment (
  id bigint primary key generated always as identity,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  specifications JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Create Project Images table
CREATE TABLE project_images (
  id bigint primary key generated always as identity,
  project_id bigint REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Create Equipment Images table
CREATE TABLE equipment_images (
  id bigint primary key generated always as identity,
  equipment_id bigint REFERENCES equipment(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE equipment_images ENABLE ROW LEVEL SECURITY;

-- Update indexes
DROP INDEX IF EXISTS idx_equipment_brand;
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_images_equipment_id ON equipment_images(equipment_id);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);

-- Policies for Projects table
CREATE POLICY "Allow public users to select projects" ON projects
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow public users to insert projects" ON projects
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow public users to update projects" ON projects
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public users to delete projects" ON projects
FOR DELETE
TO authenticated, anon
USING (true);

-- Policies for Project Images table
CREATE POLICY "Allow public users to select project images" ON project_images
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow public users to insert project images" ON project_images
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow public users to update project images" ON project_images
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public users to delete project images" ON project_images
FOR DELETE
TO authenticated, anon
USING (true);

-- Policies for Equipment table
CREATE POLICY "Allow public users to select equipment" ON equipment
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow public users to insert equipment" ON equipment
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow public users to update equipment" ON equipment
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public users to delete equipment" ON equipment
FOR DELETE
TO authenticated, anon
USING (true);

-- Policies for Equipment Images table
CREATE POLICY "Allow public users to select equipment images" ON equipment_images
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow public users to insert equipment images" ON equipment_images
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow public users to update equipment images" ON equipment_images
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public users to delete equipment images" ON equipment_images
FOR DELETE
TO authenticated, anon
USING (true);