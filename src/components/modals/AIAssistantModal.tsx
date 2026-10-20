'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { MATERIAL_PRESETS } from '../../engine/materials/MaterialFactory';

export const AIAssistantModal: React.FC = () => {
  const {
    project,
    language,
    isAIAssistantModalOpen,
    setAIAssistantModalOpen,
    updateObjectGeometry,
    updateObjectMaterial,
    updateLighting,
  } = useProjectStore();

  const selectedObject = project.objects.find((o) => o.id === project.selectedObjectId);

  const [selectedCategory, setSelectedCategory] = useState<'pharma' | 'cosmetic' | 'perfume' | 'food'>('pharma');
  const [selectedVolume, setSelectedVolume] = useState<'50ml' | '100ml' | '250ml' | '500ml'>('100ml');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  if (!isAIAssistantModalOpen) return null;

  // AI Recommendation engine
  const recommendations = {
    pharma: {
      titleAr: 'توصيات التغليف الصيدلاني والدوائي',
      titleEn: 'Pharmaceutical Packaging Advisory',
      dimsAr: 'أبعاد مثالية: 85 × 130 × 45 مم (لصناديق الشرائط والأقراص)',
      dimsEn: 'Recommended dimensions: 85 × 130 × 45 mm',
      materialsAr: 'خامة كرتون مطفي غير عاكس (Matte) لمنع الوهج أثناء قراءة الجرعات، مع زجاج كهرماني واقٍ للأشعة فوق البنفسجية.',
      materialsEn: 'Matte cardboard for high legibility + UV-protective amber glass.',
      lightingPreset: 'medical_bright',
      compliance: [
        { textAr: 'تخصيص منطقة آمنة بعرض 15 مم لكود الباركود (EAN-13 / DataMatrix)', textEn: '15mm clear zone for 2D DataMatrix/EAN-13 barcode' },
        { textAr: 'مربع مخصص لتاريخ الانتهاء ورقم التشغيلة (Batch & Expiry Box)', textEn: 'Dedicated high-contrast box for Batch No & EXP date' },
        { textAr: 'مطابقة نسبة التباين بين النص والخلفية وفق معايير FDA/WHO', textEn: 'Contrast ratio > 4.5:1 compliant with international health standards' },
      ],
    },
    cosmetic: {
      titleAr: 'توصيات مستحضرات التجميل والعناية الفاخرة',
      titleEn: 'Premium Cosmetic Studio Advisory',
      dimsAr: 'أبعاد مثالية: Ø 45 × 140 مم (أنبوب أو عبوة سيروم انسيابية)',
      dimsEn: 'Recommended dimensions: Ø 45 × 140 mm sleek dropper bottle',
      materialsAr: 'بلاستيك ناعم الملمس (Soft-touch) أو زجاج مصنفر بلوري، مع غطاء ذهبي أو كروم براق.',
      materialsEn: 'Frosted glass with metallic gold chrome accent cap.',
      lightingPreset: 'cosmetic_luxury',
      compliance: [
        { textAr: 'طباعة قائمة المكونات (INCI List) بخط واضح لا يقل عن 6 نقاط', textEn: 'Compliant INCI ingredients typography (> 6pt)' },
        { textAr: 'رمز فترة ما بعد الفتح (PAO Jar symbol 12M/24M)', textEn: 'Standard Period After Opening (PAO) icon space' },
        { textAr: 'تشطيبات رقائق معدنية لإضفاء الفخامة ورفع قيمة المنتج على الرف', textEn: 'Selective hot-foil stamping for high shelf impact' },
      ],
    },
    perfume: {
      titleAr: 'توصيات علب العطور الفاخرة',
      titleEn: 'Luxury Perfumery Packaging',
      dimsAr: 'أبعاد مثالية: 90 × 140 × 90 مم (علبة كرتون مقوى صلب Rigid Box)',
      dimsEn: 'Recommended: 90 × 140 × 90 mm rigid base-and-lid box',
      materialsAr: 'كرتون مقوى مكسو بورق منقوش ناعم مع لمعة خفيفة، وأرضية استوديو داكنة.',
      materialsEn: 'Rigid paperboard with subtle embossing & dark ambient studio.',
      lightingPreset: 'cosmetic_luxury',
      compliance: [
        { textAr: 'شعار العلامة التجارية بحجم لا يقل عن 25% من الواجهة الرئيسية', textEn: 'Hero logo coverage taking ~25% of front panel' },
        { textAr: 'حجم العبوة بالمليلتر والأونصة السائلة (e.g. 100 ml 3.4 FL. OZ.)', textEn: 'Bilingual net volume declaration in ml & FL.OZ.' },
      ],
    },
    food: {
      titleAr: 'توصيات الأغذية والمشروبات الصحية',
      titleEn: 'Gourmet Food & Beverage',
      dimsAr: 'أبعاد مثالية: 140 × 210 × 60 مم (كيس قائم ذو سحاب مانع للرطوبة)',
      dimsEn: 'Recommended: 140 × 210 × 60 mm stand-up barrier pouch',
      materialsAr: 'رقائق ألومنيوم مرنة عازلة (Foil Barrier) مع نافذة شفافة للمنتج.',
      materialsEn: 'Multi-layer barrier film with matte outer coat.',
      lightingPreset: 'ecommerce_clean',
      compliance: [
        { textAr: 'جدول القيم الغذائية القياسي (Nutrition Facts Panel)', textEn: 'Standardized Nutrition Facts label table' },
        { textAr: 'تنبيه مسببات الحساسية بخط عريض (Contains: Milk, Nuts)', textEn: 'Bold allergen warning statement' },
      ],
    },
  }[selectedCategory];

  // Apply AI recommendations directly to project
  const handleApplyAI = () => {
    if (!selectedObject) return;

    if (selectedCategory === 'pharma') {
      if (selectedObject.geometry.type === 'box') {
        updateObjectGeometry(selectedObject.id, {
          type: 'box',
          params: { width: 85, height: 130, depth: 45, cornerRadius: 1, hasLid: true },
        });
      }
      updateObjectMaterial(selectedObject.id, 'body', { ...MATERIAL_PRESETS.matte_cardboard });
    } else if (selectedCategory === 'cosmetic') {
      updateObjectMaterial(selectedObject.id, 'body', { ...MATERIAL_PRESETS.clear_glass, color: '#f8fafc' });
      if (selectedObject.materials.cap) {
        updateObjectMaterial(selectedObject.id, 'cap', { ...MATERIAL_PRESETS.gold_foil });
      }
    }

    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-surface-100 border border-surface-300/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-surface-200 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-goldGlow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{language === 'ar' ? 'مساعد التغليف الذكي (AI Studio Advisor)' : 'AI Packaging Advisor'}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SMART AI
                </span>
              </h3>
              <span className="text-[10px] text-surface-400">
                {language === 'ar' ? 'اقتراح أبعاد مدروسة، وخامات متطابقة مع المعايير، وتوزيع إضاءة مثالي' : 'Industrial standard dimensions & compliance advice'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setAIAssistantModalOpen(false)}
            className="p-1.5 text-surface-400 hover:text-white rounded-xl hover:bg-surface-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Category Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block">
              {language === 'ar' ? 'تصنيف منتجك' : 'Product Category'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'pharma', labelAr: 'دواء وصيدلة', labelEn: 'Pharma', icon: '💊' },
                { id: 'cosmetic', labelAr: 'عناية وتجميل', labelEn: 'Cosmetics', icon: '💄' },
                { id: 'perfume', labelAr: 'عطور فاخرة', labelEn: 'Perfume', icon: '✨' },
                { id: 'food', labelAr: 'أغذية وقهوة', labelEn: 'Food/Coffee', icon: '☕' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedCategory === c.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-goldGlow'
                      : 'bg-surface-50 border-surface-300/30 text-surface-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl block mb-1">{c.icon}</span>
                  <span className="text-xs font-semibold block">{language === 'ar' ? c.labelAr : c.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Cards */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-brand-400" />
                {language === 'ar' ? 'الأبعاد الموصى بها صناعياً' : 'Recommended Proportions'}
              </span>
              <p className="text-xs text-surface-300 leading-relaxed font-mono">
                {language === 'ar' ? recommendations.dimsAr : recommendations.dimsEn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-gold" />
                {language === 'ar' ? 'توصيات الخامات وتشطيبات السطح' : 'Material & Finish Advisory'}
              </span>
              <p className="text-xs text-surface-300 leading-relaxed">
                {language === 'ar' ? recommendations.materialsAr : recommendations.materialsEn}
              </p>
            </div>

            {/* Regulatory Checklist */}
            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-300/30 space-y-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {language === 'ar' ? 'قائمة التحقق الإلزامية للملصقات (Compliance Checklist)' : 'Compliance & Labeling Checklist'}
              </span>
              <div className="space-y-1.5">
                {recommendations.compliance.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-surface-300 leading-relaxed">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{language === 'ar' ? item.textAr : item.textEn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {appliedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              {language === 'ar' ? '✓ تم تطبيق توصيات الذكاء الاصطناعي على المجسم الحالي بنجاح!' : '✓ AI recommendations applied to active object!'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-surface-200 bg-surface-50 flex items-center justify-between">
          <button
            onClick={() => setAIAssistantModalOpen(false)}
            className="px-4 py-2 rounded-xl text-surface-400 hover:text-white text-xs font-medium transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>

          <button
            onClick={handleApplyAI}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-white text-xs font-bold shadow-goldGlow transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تطبيق التوصيات على المنتج الحالي' : 'Apply AI Recommendations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
