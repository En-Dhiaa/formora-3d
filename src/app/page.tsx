'use client';

import React, { useEffect } from 'react';
import { Header } from '../components/panels/Header';
import { Sidebar } from '../components/panels/Sidebar';
import { ThreeCanvas } from '../components/viewport/ThreeCanvas';
import { ExportModal } from '../components/modals/ExportModal';
import { TemplatesModal } from '../components/modals/TemplatesModal';
import { AIAssistantModal } from '../components/modals/AIAssistantModal';
import { DielineModal } from '../components/modals/DielineModal';
import { useProjectStore } from '../store/useProjectStore';

export default function PackagingStudioPage() {
  const {
    language,
    project,
    undo,
    redo,
    deleteObject,
    setSelectedObjectId,
    setExportModalOpen,
    setTemplatesModalOpen,
    setAIAssistantModalOpen,
    setDielineModalOpen,
  } = useProjectStore();

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      }
      // Delete selected object
      if (e.key === 'Delete' && project.selectedObjectId && project.objects.length > 1) {
        deleteObject(project.selectedObjectId);
      }
      // Deselect on Escape
      if (e.key === 'Escape') {
        setSelectedObjectId(null);
        setExportModalOpen(false);
        setTemplatesModalOpen(false);
        setAIAssistantModalOpen(false);
        setDielineModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project.selectedObjectId, project.objects.length, undo, redo, deleteObject, setSelectedObjectId]);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="flex flex-col h-screen w-screen bg-background overflow-hidden select-none font-sans"
    >
      {/* Top Application Bar */}
      <Header />

      {/* Main Studio Viewport & Docked Sidebar */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* 3D Viewport Canvas */}
        <section className="flex-1 relative h-full overflow-hidden">
          <ThreeCanvas />
        </section>

        {/* Right Collapsible Inspector Dock */}
        <Sidebar />
      </main>

      {/* Modals & Dialogs */}
      <ExportModal />
      <TemplatesModal />
      <AIAssistantModal />
      <DielineModal />
    </div>
  );
}
