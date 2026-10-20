'use client';

import React from 'react';
import {
  X,
  User,
  Github,
  Mail,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Heart,
  GitBranch,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';

export const DeveloperModal: React.FC = () => {
  const { isDeveloperModalOpen, setDeveloperModalOpen, language } = useProjectStore();

  if (!isDeveloperModalOpen) return null;

  const developerInfo = {
    name: 'Eng. Dhiaa Al-Hmiri',
    nameAr: 'م. ضياء الحميري',
    titleEn: 'Lead Software Engineer & 3D Systems Architect',
    titleAr: 'مهندس برمجيات ومصمم نظم ثلاثية الأبعاد',
    bioEn:
      'Creator & Architect of FORMORA 3D Studio. Passionate about computer graphics, procedural parametric CAD modeling, packaging design physics, and high-performance web applications.',
    bioAr:
      'مبتكر ومصمم نظام FORMORA 3D. متخصص في هندسة الرسوميات الحاسوبية، والنمذجة البارامترية الإجرائية للعبوات، ومحاكاة الخامات الفيزيائية، والأنظمة البرمجية عالية الأداء.',
    github: 'https://github.com/En-Dhiaa',
    repoUrl: 'https://github.com/En-Dhiaa/formora-3d',
    issuesUrl: 'https://github.com/En-Dhiaa/formora-3d/issues',
    email: 'en-dhiaa@users.noreply.github.com',
    version: 'v1.0.0 (Production)',
    buildDate: 'October 2026',
    license: 'MIT / Proprietary Commercial',
  };

  const openLink = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-surface-100 border border-surface-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-200/60 flex items-center justify-between bg-surface-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center shadow-glow">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'المطوّر والتواصل' : 'About Developer & Contact'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {developerInfo.version}
                </span>
              </h3>
              <p className="text-xs text-surface-400">
                {language === 'ar'
                  ? 'معلومات النظام، المطور، وحقوق الملكية البرمجية'
                  : 'Software engineering, credits, and direct developer contact'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setDeveloperModalOpen(false)}
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-200/60 transition-all"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Developer Spotlight Card */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-surface-50 to-surface-100 border border-brand-500/30 overflow-hidden shadow-inner">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-600 p-0.5 shadow-glow flex-shrink-0">
                <div className="w-full h-full bg-surface-100 rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-accent-cyan bg-clip-text text-transparent">
                    EA
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {language === 'ar' ? developerInfo.nameAr : developerInfo.name}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    Verified Owner
                  </span>
                </div>
                <p className="text-xs text-brand-300 font-medium mb-2">
                  {language === 'ar' ? developerInfo.titleAr : developerInfo.titleEn}
                </p>
                <p className="text-xs text-surface-300 leading-relaxed">
                  {language === 'ar' ? developerInfo.bioAr : developerInfo.bioEn}
                </p>
              </div>
            </div>

            {/* Quick Action Contact Links */}
            <div className="mt-5 pt-4 border-t border-surface-200/60 flex flex-wrap gap-2.5">
              <button
                onClick={() => openLink(developerInfo.github)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-white text-xs font-semibold border border-surface-300/40 transition-all shadow-sm group"
              >
                <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-surface-400 group-hover:text-white" />
              </button>

              <button
                onClick={() => openLink(developerInfo.repoUrl)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600/30 hover:bg-brand-600/40 text-brand-300 text-xs font-semibold border border-brand-500/40 transition-all shadow-sm group"
              >
                <GitBranch className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                <span>FORMORA 3D Repository</span>
                <ExternalLink className="w-3 h-3 text-brand-300" />
              </button>

              <button
                onClick={() => openLink(developerInfo.issuesUrl)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-200 hover:bg-surface-300 text-surface-300 hover:text-white text-xs font-medium border border-surface-300/30 transition-all"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'الإبلاغ عن خطأ أو اقتراح' : 'Report Issue / Feature'}</span>
              </button>
            </div>
          </div>

          {/* System Specs & Build Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Cpu className="w-4 h-4 text-brand-400" />
                <span>{language === 'ar' ? 'معلومات الإصدار والبناء' : 'Release Information'}</span>
              </div>
              <ul className="text-xs space-y-1.5 text-surface-400">
                <li className="flex justify-between">
                  <span>{language === 'ar' ? 'إصدار البرنامج:' : 'Version:'}</span>
                  <span className="font-mono text-white font-medium">{developerInfo.version}</span>
                </li>
                <li className="flex justify-between">
                  <span>{language === 'ar' ? 'تاريخ البناء:' : 'Build Date:'}</span>
                  <span className="font-mono text-white">{developerInfo.buildDate}</span>
                </li>
                <li className="flex justify-between">
                  <span>{language === 'ar' ? 'الترخيص المعتمد:' : 'License:'}</span>
                  <span className="text-emerald-400 font-medium">{developerInfo.license}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Mail className="w-4 h-4 text-accent-cyan" />
                <span>{language === 'ar' ? 'قناة التواصل الرسمية' : 'Developer Contact'}</span>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">
                {language === 'ar'
                  ? 'للاستفسارات الهندسية والمؤسسية، يرجى التواصل عبر البريد الرسمي أو فتح تذكرة عبر مستودع GitHub:'
                  : 'For technical inquiries or commercial customization, contact via official git metadata address:'}
              </p>
              <div className="p-2 rounded-xl bg-surface-100 border border-surface-300/30 text-[11px] font-mono text-brand-300 select-all break-all">
                {developerInfo.email}
              </div>
            </div>
          </div>

          {/* Open Source Acknowledgments & Architecture Credits */}
          <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Code2 className="w-4 h-4 text-accent-gold" />
              <span>{language === 'ar' ? 'الاعتمادات ومحركات الرسوميات مفتوحة المصدر' : 'Open Source Engines & Credits'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-300/30">
                <span className="font-bold text-white block">Three.js r165</span>
                <span className="text-surface-400 text-[10px]">3D WebGL PBR Engine</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-300/30">
                <span className="font-bold text-white block">Next.js 14</span>
                <span className="text-surface-400 text-[10px]">App Router & React 18</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-300/30">
                <span className="font-bold text-white block">Zustand</span>
                <span className="text-surface-400 text-[10px]">Reactive State & Undo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-100 border border-surface-300/30">
                <span className="font-bold text-white block">TailwindCSS</span>
                <span className="text-surface-400 text-[10px]">Styling & RTL Tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-surface-50/70 border-t border-surface-200/60 flex items-center justify-between text-xs text-surface-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'كافة البيانات محفوظة محلياً ولا يتم نقلها خارجياً' : 'Offline-first & zero telemetry'}</span>
          </div>

          <button
            onClick={() => setDeveloperModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-white font-medium transition-all"
          >
            {language === 'ar' ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
