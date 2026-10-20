'use client';

import React from 'react';
import {
  Ruler,
  Image as ImageIcon,
  Sparkles,
  Sun,
  Camera,
  Palette,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProjectStore, ActiveSidebarTab } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { DimensionsPanel } from './DimensionsPanel';
import { ArtworkPanel } from './ArtworkPanel';
import { MaterialsPanel } from './MaterialsPanel';
import { LightingPanel } from './LightingPanel';
import { CameraPanel } from './CameraPanel';
import { BackgroundPanel } from './BackgroundPanel';
import { ScenePanel } from './ScenePanel';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, language } = useProjectStore();
  const t = translations[language];

  const tabs: Array<{ id: ActiveSidebarTab; labelAr: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'dimensions', labelAr: 'الأبعاد', labelEn: 'Dimensions', icon: <Ruler className="w-4 h-4" /> },
    { id: 'artwork', labelAr: 'التصميم', labelEn: 'Artwork', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'materials', labelAr: 'الخامات', labelEn: 'Materials', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'lighting', labelAr: 'الإضاءة', labelEn: 'Lighting', icon: <Sun className="w-4 h-4" /> },
    { id: 'camera', labelAr: 'الكاميرا', labelEn: 'Camera', icon: <Camera className="w-4 h-4" /> },
    { id: 'background', labelAr: 'الخلفية', labelEn: 'Background', icon: <Palette className="w-4 h-4" /> },
    { id: 'scene', labelAr: 'المشهد', labelEn: 'Scene', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-80 md:w-96 h-full bg-surface-100/90 backdrop-blur-xl border-l border-surface-200 rtl:border-l-0 rtl:border-r flex flex-col z-20 shadow-2xl flex-shrink-0">
      {/* Top Tabs Icon Bar */}
      <div className="flex items-center justify-around p-2 border-b border-surface-200 bg-surface-50/60 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={language === 'ar' ? tab.labelAr : tab.labelEn}
              className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-surface-400 hover:text-white hover:bg-surface-200/50'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold whitespace-nowrap">
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'dimensions' && <DimensionsPanel />}
        {activeTab === 'artwork' && <ArtworkPanel />}
        {activeTab === 'materials' && <MaterialsPanel />}
        {activeTab === 'lighting' && <LightingPanel />}
        {activeTab === 'camera' && <CameraPanel />}
        {activeTab === 'background' && <BackgroundPanel />}
        {activeTab === 'scene' && <ScenePanel />}
      </div>
    </aside>
  );
};
