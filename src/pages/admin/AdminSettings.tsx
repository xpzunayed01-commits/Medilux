import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  Store, 
  Truck, 
  CreditCard, 
  Share2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { subscribeToSiteSettings, saveSiteSettings, defaultSiteSettings } from '../../lib/dataService';
import { SiteSettings } from '../../types';

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((data) => {
      setSettings(data);
    });
    return () => unsub();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSiteSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings & Configuration</h1>
          <p className="text-xs text-gray-500">Configure delivery fees, payment methods, contact details, and social links</p>
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
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Store Profile & Contact Info */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Store Information & Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.phone || settings.storePhone || ''}
                onChange={(e) => {
                  handleChange('phone', e.target.value);
                  handleChange('storePhone', e.target.value);
                }}
                placeholder="+880 1834-037142"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Support Email
              </label>
              <input
                type="email"
                value={settings.email || settings.storeEmail || ''}
                onChange={(e) => {
                  handleChange('email', e.target.value);
                  handleChange('storeEmail', e.target.value);
                }}
                placeholder="care@medilux.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Store Address
              </label>
              <input
                type="text"
                value={settings.address || settings.storeAddress || ''}
                onChange={(e) => {
                  handleChange('address', e.target.value);
                  handleChange('storeAddress', e.target.value);
                }}
                placeholder="Gulshan-2, Dhaka-1212, Bangladesh"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol || '৳'}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                placeholder="৳"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Currency Code
              </label>
              <input
                type="text"
                value={settings.currency || 'BDT'}
                onChange={(e) => handleChange('currency', e.target.value)}
                placeholder="BDT"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Delivery & Shipping Rates */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Truck size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Shipping & Delivery Fees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Inside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                value={settings.deliveryFeeDhaka ?? settings.deliveryFeeInsideDhaka ?? 80}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleChange('deliveryFeeDhaka', val);
                  handleChange('deliveryFeeInsideDhaka', val);
                }}
                placeholder="80"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Outside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                value={settings.deliveryFeeOutside ?? settings.deliveryFeeOutsideDhaka ?? 150}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleChange('deliveryFeeOutside', val);
                  handleChange('deliveryFeeOutsideDhaka', val);
                }}
                placeholder="150"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold ?? 3000}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                placeholder="3000"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Free Delivery Banner / Note Text
              </label>
              <input
                type="text"
                value={settings.freeDeliveryText || ''}
                onChange={(e) => handleChange('freeDeliveryText', e.target.value)}
                placeholder="e.g. Free Nationwide Delivery on orders over ৳3,000"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Method: Cash on Delivery */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <CreditCard size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Payment Method (Cash on Delivery)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-emerald-950">
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => handleChange('codEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Active: Cash on Delivery (COD) as primary & sole payment method across all 64 districts</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                COD Customer Instructions / Checkout Note
              </label>
              <input
                type="text"
                value={settings.codInstructions || ''}
                onChange={(e) => handleChange('codInstructions', e.target.value)}
                placeholder="Pay with cash upon delivery of your parcel at your doorstep"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Social Media Links */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Share2 size={18} className="text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Social Media Links
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Facebook Page Link
              </label>
              <input
                type="url"
                value={settings.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/medilux"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Instagram Page Link
              </label>
              <input
                type="url"
                value={settings.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/medilux"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+8801834037142"
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
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
