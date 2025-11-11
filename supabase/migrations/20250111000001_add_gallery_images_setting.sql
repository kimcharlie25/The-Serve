/*
  # Add Gallery Images Setting
  
  Add gallery_images setting to site_settings table
*/

-- Insert gallery_images setting with default empty array
INSERT INTO site_settings (id, value, type, description) VALUES
  ('gallery_images', '[]', 'text', 'Gallery images displayed on the homepage')
ON CONFLICT (id) DO NOTHING;

