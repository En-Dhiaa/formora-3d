'use client';

import React, { useRef } from 'react';
import {
  Box,
  Download,
  FolderOpen,
  Save,
  RotateCcw,
  RotateCw,
  Sparkles,
  Globe,
  Plus,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { translations } from '../../utils/translations';
import { Unit } from '../../types';
import { createDefaultProject } from '../../utils/sampleData';

export const Header: React.FC = () => {
  const {
    project,
    language,
    history,
    future,
    setLanguage,
    updateProjectName,
    setProject,
    setExportModalOpen,
    setTemplatesModalOpen,
    setAIAssistantModalOpen,
    undo,
    redo,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // Save project file to JSON
  const handleSaveProject = () => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_formora3d.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open project file from JSON
  const handleOpenProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loaded = JSON.parse(event.target?.result as string);
        if (loaded && loaded.objects) {
          setProject(loaded);
        }
      } catch (err) {
        alert(language === 'ar' ? 'فشل تحميل ملف المشروع' : 'Failed to parse project file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleNewProject = () => {
    if (confirm(language === 'ar' ? 'هل تريد بدء مشروع جديد؟' : 'Start a new project?')) {
      setProject(createDefaultProject());
    }
  };

  return (
    <header className="h-14 bg-surface-100/90 backdrop-blur-md border-b border-surface-200 px-4 flex items-center justify-between select-none z-30">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-glow">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white">
                {t.app.name}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                PRO 3D
              </span>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-5 bg-surface-300/40 mx-2 hidden sm:block" />

        {/* Editable Project Name */}
        <input
          type="text"
          value={project.name}
          onChange={(e) => updateProjectName(e.target.value)}
          className="bg-transparent hover:bg-surface-200/50 focus:bg-surface-200 border border-transparent focus:border-brand-500/50 px-2.5 py-1 rounded-lg text-xs font-medium text-surface-400 focus:text-white transition-all outline-none max-w-[200px] sm:max-w-[280px]"
          title={language === 'ar' ? 'انقر لتعديل اسم المشروع' : 'Click to rename project'}
        />
      </div>

      {/* Main Action Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-surface-50 p-1 rounded-xl border border-surface-300/30">
          <button
            onClick={undo}
            disabled={history.length === 0}
            title={t.actions.undo}
            className="p-1.5 text-surface-400 hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title={t.actions.redo}
            className="p-1.5 text-surface-400 hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Template Browser */}
        <button
          onClick={() => setTemplatesModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 text-white text-xs font-medium border border-surface-300/30 transition-all shadow-sm"
        >
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span className="hidden md:inline">{t.nav.templates}</span>
        </button>

        {/* AI Packaging Advisor */}
        <button
          onClick={() => setAIAssistantModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-brand-500/20 hover:from-amber-500/30 hover:to-brand-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all shadow-goldGlow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.nav.aiAssistant}</span>
        </button>

        {/* New / Open / Save */}
        <div className="flex items-center gap-1 bg-surface-50 p-1 rounded-xl border border-surface-300/30">
          <button
            onClick={handleNewProject}
            title={t.nav.newProject}
            className="p-1.5 text-surface-400 hover:text-white rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title={t.nav.openProject}
            className="p-1.5 text-surface-400 hover:text-white rounded-lg transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleOpenProject}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleSaveProject}
            title={t.nav.saveProject}
            className="p-1.5 text-surface-400 hover:text-white rounded-lg transition-all"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-50 hover:bg-surface-200 border border-surface-300/30 rounded-xl text-xs font-medium text-surface-400 hover:text-white transition-all"
          title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <Globe className="w-3.5 h-3.5 text-brand-400" />
          <span className="uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Export Render Button */}
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.actions.export}</span>
        </button>
      </div>
    </header>
  );
};
