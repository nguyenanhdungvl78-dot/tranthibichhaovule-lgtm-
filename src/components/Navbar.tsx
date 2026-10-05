import React from 'react';
import {
  FileText,
  PlayCircle,
  Edit3,
  Printer,
  Sparkles,
  Cloud,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type AppMode = 'view' | 'practice' | 'edit' | 'print';

interface NavbarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  selectedGrade: number;
  onGradeChange: (grade: number) => void;
  onOpenSampleModal: () => void;
  onOpenAIModal: () => void;
  onOpenDriveModal: () => void;
  user: User | null;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onModeChange,
  selectedGrade,
  onGradeChange,
  onOpenSampleModal,
  onOpenAIModal,
  onOpenDriveModal,
  user,
  isLoggingIn,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100 flex-shrink-0">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Toán THCS 7991
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  CV 7991/BGDĐT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Phiếu bài tập chuẩn 3 dạng trắc nghiệm & tự luận
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onModeChange('view')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentMode === 'view'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Xem đề</span>
            </button>
            <button
              onClick={() => onModeChange('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentMode === 'practice'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Làm bài</span>
            </button>
            <button
              onClick={() => onModeChange('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentMode === 'edit'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Biên soạn</span>
            </button>
            <button
              onClick={() => onModeChange('print')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentMode === 'print'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>In ấn / PDF</span>
            </button>
          </nav>

          {/* Right Action Tools & Auth */}
          <div className="flex items-center gap-2">
            {/* Grade Selector */}
            <select
              value={selectedGrade}
              onChange={(e) => onGradeChange(Number(e.target.value))}
              aria-label="Chọn khối lớp THCS"
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value={6}>Lớp 6</option>
              <option value={7}>Lớp 7</option>
              <option value={8}>Lớp 8</option>
              <option value={9}>Lớp 9</option>
            </select>

            {/* Sample Library */}
            <button
              onClick={onOpenSampleModal}
              title="Thư viện đề mẫu chuẩn"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Đề mẫu</span>
            </button>

            {/* AI Generator */}
            <button
              onClick={onOpenAIModal}
              title="Tạo đề bằng AI Gemini"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">AI Tạo đề</span>
            </button>

            {/* Google Drive Integration Button */}
            <button
              onClick={onOpenDriveModal}
              title="Quản lý Google Drive"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition shadow-2xs"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Google Drive</span>
            </button>

            {/* Google Sign-in / User Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button"
                style={{ height: '34px', fontSize: '12px' }}
                title="Đăng nhập Google để đồng bộ Google Drive"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents hidden sm:inline">
                    {isLoggingIn ? 'Đang kết nối...' : 'Đăng nhập Google'}
                  </span>
                  <span className="gsi-material-button-contents sm:hidden">
                    {isLoggingIn ? '...' : 'Google'}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => onModeChange('view')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentMode === 'view' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'
            }`}
          >
            Xem đề
          </button>
          <button
            onClick={() => onModeChange('practice')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentMode === 'practice' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
            }`}
          >
            Làm bài
          </button>
          <button
            onClick={() => onModeChange('edit')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentMode === 'edit' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'
            }`}
          >
            Biên soạn
          </button>
          <button
            onClick={() => onModeChange('print')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentMode === 'print' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'
            }`}
          >
            In ấn / PDF
          </button>
        </div>
      </div>
    </header>
  );
};
