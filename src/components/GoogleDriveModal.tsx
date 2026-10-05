import React, { useState, useEffect } from 'react';
import {
  listWorksheetsFromDrive,
  saveWorksheetToDrive,
  loadWorksheetFromDrive,
  deleteWorksheetFromDrive,
  DriveWorksheetFile,
} from '../services/googleDriveService';
import { Worksheet } from '../types/worksheet';
import { ConfirmModal } from './ConfirmModal';
import {
  Cloud,
  Download,
  Trash2,
  Upload,
  RefreshCw,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorksheet: Worksheet;
  onLoadWorksheet: (loaded: Worksheet) => void;
  user: User | null;
  onLogin: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentWorksheet,
  onLoadWorksheet,
  user,
  onLogin,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveWorksheetFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Destructive confirmation modal state
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<DriveWorksheetFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load list when modal opens & user logged in
  useEffect(() => {
    if (isOpen && user) {
      handleRefreshList();
    }
  }, [isOpen, user]);

  const handleRefreshList = async () => {
    if (!user) return;
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const files = await listWorksheetsFromDrive();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Không thể tải danh sách tệp từ Google Drive.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!user) {
      onLogin();
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      await saveWorksheetToDrive(currentWorksheet);
      setStatusMessage({
        type: 'success',
        text: `Đã lưu thành công "${currentWorksheet.metadata.title}" lên Google Drive!`,
      });
      await handleRefreshList();
    } catch (err: any) {
      console.error('Error saving to drive:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Lỗi khi lưu lên Google Drive.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFile = async (file: DriveWorksheetFile) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const loaded = await loadWorksheetFromDrive(file.id);
      onLoadWorksheet(loaded);
      setStatusMessage({
        type: 'success',
        text: `Đã tải đề "${loaded.metadata.title}" từ Google Drive thành công!`,
      });
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Error loading file from drive:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Không thể tải nội dung tệp từ Google Drive.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Perform deletion after user confirms in ConfirmModal
  const handleExecuteDelete = async () => {
    if (!confirmDeleteFile) return;
    setIsDeleting(true);
    try {
      await deleteWorksheetFromDrive(confirmDeleteFile.id);
      setStatusMessage({
        type: 'success',
        text: `Đã xóa tệp "${confirmDeleteFile.name}" trên Google Drive.`,
      });
      setConfirmDeleteFile(null);
      await handleRefreshList();
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Xóa tệp thất bại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Google Drive Workspace</h3>
                <p className="text-xs text-slate-500">
                  Lưu trữ và đồng bộ hóa các phiếu bài tập Toán THCS trực tiếp trên tài khoản Google của bạn
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Status alerts */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Non-authenticated state */}
            {!user ? (
              <div className="text-center py-10 px-4 space-y-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Chưa kết nối Google Drive</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Đăng nhập tài khoản Google của bạn để tải lên, lưu trữ và mở các đề kiểm tra Toán bất kỳ lúc nào.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="gsi-material-button shadow-sm"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">Đăng nhập với Google</span>
                  </div>
                </button>
              </div>
            ) : (
              <>
                {/* Save Current Worksheet Action Card */}
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Lưu phiếu hiện tại
                    </h4>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">
                      {currentWorksheet.metadata.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Toán Lớp {currentWorksheet.metadata.grade} • {currentWorksheet.metadata.topic}
                    </p>
                  </div>
                  <button
                    onClick={handleSaveToDrive}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition flex-shrink-0"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Đang tải lên...' : 'Lưu lên Drive'}</span>
                  </button>
                </div>

                {/* List of files on Drive */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Tệp đã lưu trên Google Drive</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {driveFiles.length}
                      </span>
                    </h4>
                    <button
                      onClick={handleRefreshList}
                      disabled={isLoading}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Làm mới</span>
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Đang đồng bộ hóa từ Google Drive...
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-slate-200 rounded-xl">
                      Chưa có phiếu bài tập nào trên Google Drive của bạn. Nhấn "Lưu lên Drive" ở trên để lưu đề đầu tiên.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden max-h-60 overflow-y-auto">
                      {driveFiles.map((f) => (
                        <div
                          key={f.id}
                          className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate" title={f.name}>
                                {f.description || f.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Cập nhật: {new Date(f.modifiedTime).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleLoadFile(f)}
                              title="Tải vào ứng dụng"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteFile(f)}
                              title="Xóa khỏi Google Drive"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog for Destructive Operations on Google Drive */}
      <ConfirmModal
        isOpen={!!confirmDeleteFile}
        title="Xóa tệp khỏi Google Drive?"
        message="Bạn có chắc chắn muốn xóa tệp này trên Google Drive của bạn không? Thao tác này sẽ xóa tệp vĩnh viễn và không thể hoàn tác."
        detail={confirmDeleteFile ? confirmDeleteFile.name : undefined}
        confirmText="Xác nhận xóa tệp"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleExecuteDelete}
        onCancel={() => setConfirmDeleteFile(null)}
      />
    </>
  );
};
