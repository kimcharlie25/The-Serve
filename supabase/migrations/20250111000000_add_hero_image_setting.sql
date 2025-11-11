/*
  # Add Hero Image Setting
  
  Add hero_image setting to site_settings table
*/

-- Insert hero_image setting with default value
INSERT INTO site_settings (id, value, type, description) VALUES
  ('hero_image', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80', 'image', 'Hero/banner image displayed on the homepage')
ON CONFLICT (id) DO NOTHING;

