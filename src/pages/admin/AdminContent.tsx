import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Save, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon,
  Eye,
  Megaphone
} from 'lucide-react';
import { subscribeToSiteContent, saveSiteContent, defaultSiteContent } from '../../lib/dataService';
import { SiteContent } from '../../types';

export function AdminContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSiteContent((data) => {
      setContent(data);
    });
    return () => unsub();
  }, []);

  const handleChange = (field: keyof SiteContent, value: any) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSiteContent(content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save website content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Content Editor</h1>
          <p className="text-xs text-gray-500">Edit homepage hero banner, headlines, stories, and announcement bar</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#0F2417] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check size={16} className="text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save All Content'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Top Announcement Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-emerald-700" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Top Announcement / Promo Bar
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="checkbox"
                checked={content.promoBarActive}
                onChange={(e) => handleChange('promoBarActive', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Active on Website</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={content.promoBarText}
              onChange={(e) => handleChange('promoBarText', e.target.value)}
              placeholder="e.g. Free shipping across Bangladesh on orders over ৳3,000"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. Homepage Hero Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Sparkles size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Homepage Hero Section
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Main Hero Headline (Use new line for multi-line break)
              </label>
              <textarea
                rows={2}
                value={content.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="EVERYDAY,&#10;ELEVATED."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="Surreal, artistic wellness and lifestyle rituals."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.heroButtonText}
                onChange={(e) => handleChange('heroButtonText', e.target.value)}
                placeholder="SHOP NOW"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                CTA Button Link
              </label>
              <input
                type="text"
                value={content.heroButtonLink}
                onChange={(e) => handleChange('heroButtonLink', e.target.value)}
                placeholder="/shop"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Hero Background Image URL
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="url"
                  value={content.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {content.heroImage && (
                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100 relative">
                    <img
                      referrerPolicy="no-referrer"
                      src={content.heroImage}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Brand Story Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Type size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Brand Story Section
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Story Headline
            </label>
            <textarea
              rows={2}
              value={content.storyHeading}
              onChange={(e) => handleChange('storyHeading', e.target.value)}
              placeholder="GOOD THINGS BELONG&#10;IN EVERYDAY LIFE."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Story Paragraph Content
            </label>
            <textarea
              rows={4}
              value={content.storyBody}
              onChange={(e) => handleChange('storyBody', e.target.value)}
              placeholder="Medilux redefines the mundane..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* 4. Promotional Banner */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <ImageIcon size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Promotional Banner (Optional)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Banner Headline / Tag
              </label>
              <input
                type="text"
                value={content.bannerTitle || ''}
                onChange={(e) => handleChange('bannerTitle', e.target.value)}
                placeholder="Pure Organic Nutrition & Holistic Care"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Banner Image URL
              </label>
              <input
                type="url"
                value={content.bannerImage || ''}
                onChange={(e) => handleChange('bannerImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#0F2417] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
