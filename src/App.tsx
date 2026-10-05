import React, { useState, useEffect } from 'react';
import { Worksheet, GradeLevel } from './types/worksheet';
import { SAMPLE_WORKSHEETS } from './data/sampleWorksheets';
import { Navbar, AppMode } from './components/Navbar';
import { WorksheetViewer } from './components/WorksheetViewer';
import { WorksheetPractice } from './components/WorksheetPractice';
import { WorksheetEditor } from './components/WorksheetEditor';
import { PrintWorksheet } from './components/PrintWorksheet';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { SampleWorksheetsModal } from './components/SampleWorksheetsModal';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { User } from 'firebase/auth';

export default function App() {
  // Current worksheet in state with localStorage persistence
  const [worksheet, setWorksheet] = useState<Worksheet>(() => {
    const saved = localStorage.getItem('kntt_current_worksheet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.metadata && parsed.part1 && parsed.part2 && parsed.part3 && parsed.part4) {
          return parsed;
        }
      } catch {}
    }
    return SAMPLE_WORKSHEETS[0];
  });
  const [currentMode, setCurrentMode] = useState<AppMode>('view');

  // Save current worksheet whenever updated
  useEffect(() => {
    localStorage.setItem('kntt_current_worksheet', JSON.stringify(worksheet));
  }, [worksheet]);

  // Modals state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Grade filter change
  const handleGradeChange = (grade: number) => {
    const found = SAMPLE_WORKSHEETS.find((w) => w.metadata.grade === grade);
    if (found) {
      setWorksheet(found);
    } else {
      // Update current worksheet grade
      setWorksheet((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, grade: grade as GradeLevel },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        selectedGrade={worksheet.metadata.grade}
        onGradeChange={handleGradeChange}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        user={user}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentMode === 'view' && (
          <WorksheetViewer
            worksheet={worksheet}
            onStartPractice={() => setCurrentMode('practice')}
            onStartEdit={() => setCurrentMode('edit')}
            onPrint={() => setCurrentMode('print')}
          />
        )}

        {currentMode === 'practice' && (
          <WorksheetPractice
            worksheet={worksheet}
            onExit={() => setCurrentMode('view')}
          />
        )}

        {currentMode === 'edit' && (
          <WorksheetEditor
            worksheet={worksheet}
            onSave={(updated) => {
              setWorksheet(updated);
              setCurrentMode('view');
            }}
            onAutoSave={(updated) => {
              setWorksheet(updated);
            }}
            onCancel={() => setCurrentMode('view')}
          />
        )}

        {currentMode === 'print' && (
          <PrintWorksheet
            worksheet={worksheet}
            onExit={() => setCurrentMode('view')}
          />
        )}
      </main>

      {/* Modals */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        currentWorksheet={worksheet}
        onLoadWorksheet={(loaded) => {
          setWorksheet(loaded);
          setCurrentMode('view');
        }}
        user={user}
        onLogin={handleLogin}
      />

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentGrade={worksheet.metadata.grade}
        onGenerated={(gen) => {
          setWorksheet(gen);
          setCurrentMode('view');
        }}
      />

      <SampleWorksheetsModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectWorksheet={(selected) => {
          setWorksheet(selected);
          setCurrentMode('view');
        }}
        currentWorksheet={worksheet}
      />
    </div>
  );
}
