'use client';

import React, { useState } from 'react';
import {
  X,
  Layers,
  Search,
  Plus,
  Box,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { TemplateType } from '../../types';

interface TemplateItem {
  id: string;
  type: TemplateType;
  category: 'pharma' | 'cosmetics' | 'food' | 'general';
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  defaultDims: string;
}

export const TemplatesModal: React.FC = () => {
  const {
    language,
    isTemplatesModalOpen,
    setTemplatesModalOpen,
    addObjectByTemplate,
  } = useProjectStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isTemplatesModalOpen) return null;

  const templates: TemplateItem[] = [
    {
      id: 'pharma_box',
      type: 'box',
      category: 'pharma',
      nameAr: 'علبة دواء كرتونية مع كود برايل',
      nameEn: 'Pharmaceutical Blister Box',
      descAr: 'مثالية لأقراص الدواء والمستحضرات الطبية مع مطابقة نسب الوجه والظهر.',
      descEn: 'Standard medicine box with 6 printable sides and fold lines.',
      icon: '💊',
      defaultDims: '80 × 120 × 40 mm',
    },
    {
      id: 'amber_bottle',
      type: 'cylinder_bottle',
      category: 'pharma',
      nameAr: 'عبوة زجاجية كهرمانية لشراب السعال',
      nameEn: 'Amber Cough Syrup Bottle',
      descAr: 'زجاج واقٍ من الضوء مع غطاء أمان ضد عبث الأطفال.',
      descEn: 'Amber glass bottle with rounded shoulder & child-resistant cap.',
      icon: '🍾',
      defaultDims: 'Ø 55 × 140 mm',
    },
    {
      id: 'cosmetic_tube',
      type: 'squeeze_tube',
      category: 'cosmetics',
      nameAr: 'أنبوب كريم تجميلي مرن',
      nameEn: 'Cosmetic Cream Squeeze Tube',
      descAr: 'أنبوب مع غطاء قلاب وشريط لحام علوي عريض.',
      descEn: 'Flexible polymer tube with top crimp and flip-top cap.',
      icon: '🧴',
      defaultDims: 'Ø 40 × 150 mm',
    },
    {
      id: 'food_pouch',
      type: 'flexible_pouch',
      category: 'food',
      nameAr: 'كيس مرن قائم مع سحاب (Doypack)',
      nameEn: 'Stand-up Zipper Foil Pouch',
      descAr: 'للأغذية والقهوة مع قاعدة ممتدة ولحام جانبي ثلاثي.',
      descEn: 'Stand-up foil pouch with ziplock and bottom gusset.',
      icon: '☕',
      defaultDims: '140 × 200 × 60 mm',
    },
    {
      id: 'oval_shampoo',
      type: 'oval_bottle',
      category: 'cosmetics',
      nameAr: 'عبوة بيضاوية لشامبو وعناية',
      nameEn: 'Oval Care & Shampoo Bottle',
      descAr: 'شكل انسيابي مريح لليد مع ملصق أمامي وخلفي مقوس.',
      descEn: 'Ergonomic oval cross-section with curved label wraps.',
      icon: '🛁',
      defaultDims: '75 × 45 × 180 mm',
    },
    {
      id: 'luxury_perfume',
      type: 'box',
      category: 'cosmetics',
      nameAr: 'صندوق عطر فاخر بغطاء منفصل',
      nameEn: 'Luxury Perfume Rigid Box',
      descAr: 'كرتون سميك فاخر بلمسات معدنية ذهبية وملمس مطفي.',
      descEn: 'Premium rigid packaging with metallic foil finish.',
      icon: '✨',
      defaultDims: '90 × 140 × 90 mm',
    },
  ];

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'pharma', labelAr: 'صيدلاني وطبي', labelEn: 'Pharmaceutical' },
    { id: 'cosmetics', labelAr: 'عناية وتجميل', labelEn: 'Cosmetics' },
    { id: 'food', labelAr: 'أغذية ومشروبات', labelEn: 'Food & Beverage' },
  ];

  const filtered = templates.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      t.nameAr.includes(searchQuery) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectTemplate = (item: TemplateItem) => {
    addObjectByTemplate(item.type);
    setTemplatesModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-surface-100 border border-surface-300/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'مكتبة قوالب التغليف الذكية' : 'Packaging Template Library'}
              </h3>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'قوالب جاهزة بمعايير صناعية قابلة للتعديل' : 'Production-ready packaging templates'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="p-1.5 text-surface-400 hover:text-white rounded-xl hover:bg-surface-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 px-6 border-b border-surface-200 bg-surface-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-100 p-1 rounded-xl border border-surface-300/30 w-full sm:w-auto overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === c.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? c.labelAr : c.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-surface-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في القوالب...' : 'Search templates...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-100 border border-surface-300/40 rounded-xl px-8 py-1.5 text-xs text-white placeholder-surface-400 focus:border-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 custom-scrollbar">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectTemplate(item)}
              className="p-4 rounded-2xl bg-surface-50 hover:bg-surface-200/50 border border-surface-300/30 hover:border-brand-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-surface-100 text-[10px] font-mono text-brand-400 border border-surface-300/30">
                    {item.defaultDims}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors mb-1">
                  {language === 'ar' ? item.nameAr : item.nameEn}
                </h4>

                <p className="text-[11px] text-surface-400 leading-relaxed mb-3">
                  {language === 'ar' ? item.descAr : item.descEn}
                </p>
              </div>

              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-100 group-hover:bg-brand-600 text-surface-400 group-hover:text-white text-xs font-semibold transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة للمشهد' : 'Add to Scene'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
