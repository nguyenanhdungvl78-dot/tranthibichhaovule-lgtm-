import React, { useRef } from 'react';
import { SAMPLE_WORKSHEETS } from '../data/sampleWorksheets';
import { Worksheet } from '../types/worksheet';
import { BookOpen, X, Clock, Award, Upload, Download } from 'lucide-react';

interface SampleWorksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorksheet: (worksheet: Worksheet) => void;
  currentWorksheet: Worksheet;
}

export const SampleWorksheetsModal: React.FC<SampleWorksheetsModalProps> = ({
  isOpen,
  onClose,
  onSelectWorksheet,
  currentWorksheet,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(currentWorksheet, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `toan_${currentWorksheet.metadata.grade}_${currentWorksheet.metadata.title.replace(/[\s\/:]/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.metadata && parsed.part1 && parsed.part2 && parsed.part3 && parsed.part4) {
          onSelectWorksheet(parsed as Worksheet);
          onClose();
        } else {
          alert('Tệp JSON không đúng cấu trúc đề bài Toán chuẩn CV 7991.');
        }
      } catch (err) {
        alert('Không thể đọc file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Thư Viện Đề Mẫu Chuẩn CV 7991</h3>
              <p className="text-xs text-slate-500">
                Chọn các bộ đề mẫu có sẵn cho Khối 6, 7, 8, 9 hoặc xuất/nhập tệp
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

        {/* Body list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {SAMPLE_WORKSHEETS.map((ws) => {
            const isCurrent = ws.metadata.id === currentWorksheet.metadata.id;
            const totalScore =
              ws.part1.reduce((s, q) => s + q.points, 0) +
              ws.part2.reduce((s, q) => s + q.points, 0) +
              ws.part3.reduce((s, q) => s + q.points, 0) +
              ws.part4.reduce((s, q) => s + q.points, 0);

            return (
              <div
                key={ws.metadata.id}
                onClick={() => {
                  onSelectWorksheet(ws);
                  onClose();
                }}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                  isCurrent
                    ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700 mb-1">
                      Toán Lớp {ws.metadata.grade}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{ws.metadata.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {ws.metadata.topic}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      Đang chọn
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ws.metadata.durationMinutes} phút</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{totalScore.toFixed(2)} điểm</span>
                  </span>
                  <span>
                    {ws.part1.length} TN đơn • {ws.part2.length} Đúng/Sai • {ws.part3.length} TL ngắn
                    • {ws.part4.length} Tự luận
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Import / Export */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
