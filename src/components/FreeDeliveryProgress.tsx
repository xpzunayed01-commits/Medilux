import React, { useState, useEffect } from 'react';
import { Truck, Check, Sparkles } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { subscribeToSiteSettings, defaultSiteSettings } from '../lib/dataService';
import { SiteSettings } from '../types';

interface FreeDeliveryProgressProps {
  currentAmount: number;
  className?: string;
  variant?: 'compact' | 'expanded';
}

export function FreeDeliveryProgress({ currentAmount, className = '', variant = 'compact' }: FreeDeliveryProgressProps) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((data) => {
      if (data) setSettings(data);
    });
    return () => unsub();
  }, []);

  const threshold = settings.freeDeliveryThreshold ?? 3000;
  const isUnlocked = currentAmount >= threshold;
  const remaining = Math.max(0, threshold - currentAmount);
  const percentage = Math.min(100, Math.round((currentAmount / threshold) * 100));

  if (!threshold || threshold <= 0) return null;

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isUnlocked 
        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-xs' 
        : 'bg-[#F9F8F6] border-black/5 text-gray-800'
    } ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
          {isUnlocked ? (
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Check size={12} strokeWidth={2.5} />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Truck size={12} strokeWidth={2} />
            </div>
          )}
          
          {isUnlocked ? (
            <span className="font-semibold text-emerald-900">
              Complimentary Nationwide Delivery Unlocked!
            </span>
          ) : (
            <span>
              Add <strong className="font-bold text-primary">{formatPrice(remaining)}</strong> more for <span className="font-semibold text-emerald-800">FREE Delivery</span>
            </span>
          )}
        </div>

        <span className="text-[11px] font-bold text-gray-500 tabular-nums">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden relative">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isUnlocked 
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm' 
              : 'bg-gradient-to-r from-primary/70 to-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {variant === 'expanded' && (
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
          <span>৳0</span>
          <span className="font-medium text-emerald-700">Free over {formatPrice(threshold)}</span>
        </div>
      )}
    </div>
  );
}
