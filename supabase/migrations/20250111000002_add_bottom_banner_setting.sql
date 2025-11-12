/*
  # Add Bottom Banner Image Setting
  
  Add bottom_banner_image setting to site_settings table
*/

-- Insert bottom_banner_image setting with default value
INSERT INTO site_settings (id, value, type, description) VALUES
  ('bottom_banner_image', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=2000&q=80', 'image', 'Bottom banner image displayed below the gallery on the homepage')
ON CONFLICT (id) DO NOTHING;

