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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSiteContent((data) => {
      if (!isInitialized) {
        setContent(data);
        setIsInitialized(true);
      }
    });
    return () => unsub();
  }, [isInitialized]);

  const handleChange = (field: keyof SiteContent, value: any) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        {/* 1. Homepage Perks & Delivery Strip */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Megaphone size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Homepage Perks & Free Delivery Strip (Below Hero)
            </h2>
          </div>

          <p className="text-xs text-gray-500">
            Customize the 4 key highlight perks shown directly underneath the main homepage hero banner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Perk 1: Free Delivery */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Perk 1: Free Shipping</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.perkDeliveryTitle || ''}
                  onChange={(e) => handleChange('perkDeliveryTitle', e.target.value)}
                  placeholder="Free Delivery"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Subtitle / Note</label>
                <input
                  type="text"
                  value={content.perkDeliverySubtitle || ''}
                  onChange={(e) => handleChange('perkDeliverySubtitle', e.target.value)}
                  placeholder="On orders over ৳3,000"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Perk 2: Authentic */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Perk 2: Authenticity</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.perkAuthenticTitle || ''}
                  onChange={(e) => handleChange('perkAuthenticTitle', e.target.value)}
                  placeholder="100% Authentic"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Subtitle / Note</label>
                <input
                  type="text"
                  value={content.perkAuthenticSubtitle || ''}
                  onChange={(e) => handleChange('perkAuthenticSubtitle', e.target.value)}
                  placeholder="Direct formulation & care"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Perk 3: Cash on Delivery */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Perk 3: Cash On Delivery</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.perkCodTitle || ''}
                  onChange={(e) => handleChange('perkCodTitle', e.target.value)}
                  placeholder="Cash on Delivery"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Subtitle / Note</label>
                <input
                  type="text"
                  value={content.perkCodSubtitle || ''}
                  onChange={(e) => handleChange('perkCodSubtitle', e.target.value)}
                  placeholder="Available nationwide"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Perk 4: Fast Dispatch */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Perk 4: Dispatch & Care</span>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={content.perkSupportTitle || ''}
                  onChange={(e) => handleChange('perkSupportTitle', e.target.value)}
                  placeholder="Fast Dispatch"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Subtitle / Note</label>
                <input
                  type="text"
                  value={content.perkSupportSubtitle || ''}
                  onChange={(e) => handleChange('perkSupportSubtitle', e.target.value)}
                  placeholder="Within 24-48 hours"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
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
