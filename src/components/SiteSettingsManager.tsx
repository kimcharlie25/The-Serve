import React, { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [bottomBannerFile, setBottomBannerFile] = useState<File | null>(null);
  const [bottomBannerPreview, setBottomBannerPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
      setHeroPreview(siteSettings.hero_image);
      setGalleryImages(siteSettings.gallery_images || []);
      setBottomBannerPreview(siteSettings.bottom_banner_image);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const uploadPromises = Array.from(files).map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        const newGalleryImages = [...galleryImages, ...uploadedUrls];
        setGalleryImages(newGalleryImages);
        await updateSiteSettings({ gallery_images: newGalleryImages });
      } catch (error) {
        console.error('Error uploading gallery images:', error);
        alert('Failed to upload some images. Please try again.');
      }
    }
  };

  const handleGalleryRemove = async (index: number) => {
    if (confirm('Are you sure you want to remove this image from the gallery?')) {
      const newGalleryImages = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(newGalleryImages);
      await updateSiteSettings({ gallery_images: newGalleryImages });
    }
  };

  const handleBottomBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBottomBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBottomBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;
      let heroUrl = heroPreview;
      
      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile);
        logoUrl = uploadedUrl;
      }

      // Upload new hero image if selected
      if (heroFile) {
        const uploadedUrl = await uploadImage(heroFile);
        heroUrl = uploadedUrl;
      }

      // Upload new bottom banner if selected
      let bottomBannerUrl = bottomBannerPreview;
      if (bottomBannerFile) {
        const uploadedUrl = await uploadImage(bottomBannerFile);
        bottomBannerUrl = uploadedUrl;
      }

      // Update all settings
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        site_logo: logoUrl,
        hero_image: heroUrl,
        bottom_banner_image: bottomBannerUrl
      });

      setIsEditing(false);
      setLogoFile(null);
      setHeroFile(null);
      setBottomBannerFile(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code
      });
      setLogoPreview(siteSettings.site_logo);
      setHeroPreview(siteSettings.hero_image);
      setGalleryImages(siteSettings.gallery_images || []);
      setBottomBannerPreview(siteSettings.bottom_banner_image);
    }
    setIsEditing(false);
    setLogoFile(null);
    setHeroFile(null);
    setBottomBannerFile(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-noto font-semibold text-black">Site Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Logo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl text-gray-400">☕</div>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site name"
            />
          ) : (
            <p className="text-lg font-medium text-black">{siteSettings?.site_name}</p>
          )}
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          {isEditing ? (
            <textarea
              name="site_description"
              value={formData.site_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter site description"
            />
          ) : (
            <p className="text-gray-600">{siteSettings?.site_description}</p>
          )}
        </div>

        {/* Hero Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image (Homepage Banner)
          </label>
          <div className="space-y-4">
            {heroPreview && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={heroPreview}
                  alt="Hero Image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroChange}
                  className="hidden"
                  id="hero-upload"
                />
                <label
                  htmlFor="hero-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer inline-flex"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Hero Image</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gallery Images
          </label>
          <div className="space-y-4">
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleGalleryRemove(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryAdd}
                  className="hidden"
                  id="gallery-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="gallery-upload"
                  className={`bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer inline-flex ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? 'Uploading...' : 'Add Gallery Images'}</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">You can select multiple images at once</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banner Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bottom Banner Image (Below Gallery)
          </label>
          <div className="space-y-4">
            {bottomBannerPreview && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={bottomBannerPreview}
                  alt="Bottom Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBottomBannerChange}
                  className="hidden"
                  id="bottom-banner-upload"
                />
                <label
                  htmlFor="bottom-banner-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer inline-flex"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Bottom Banner</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., ₱, $, €"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency_code"
                value={formData.currency_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., PHP, USD, EUR"
              />
            ) : (
              <p className="text-lg font-medium text-black">{siteSettings?.currency_code}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
