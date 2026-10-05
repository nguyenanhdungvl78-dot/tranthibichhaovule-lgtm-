import React, { useState, useEffect } from 'react';
import {
  Worksheet,
  Part1Question,
  Part2Question,
  Part3Question,
  Part4Question,
  CognitiveLevel,
  GradeLevel,
} from '../types/worksheet';
import { MathRenderer } from './MathRenderer';
import { MathSymbolPicker } from './MathSymbolPicker';
import {
  Plus,
  Minus,
  Trash2,
  Save,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface WorksheetEditorProps {
  worksheet: Worksheet;
  onSave: (updated: Worksheet) => void;
  onAutoSave?: (updated: Worksheet) => void;
  onCancel: () => void;
}

export const WorksheetEditor: React.FC<WorksheetEditorProps> = ({
  worksheet,
  onSave,
  onAutoSave,
  onCancel,
}) => {
  const [data, setData] = useState<Worksheet>(JSON.parse(JSON.stringify(worksheet)));
  const [activeTab, setActiveTab] = useState<'info' | 'part1' | 'part2' | 'part3' | 'part4'>('info');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Vừa xong');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [focusedInputInfo, setFocusedInputInfo] = useState<{
    target: string;
    index?: number;
    subKey?: string;
  } | null>(null);

  // Auto-save whenever data changes
  useEffect(() => {
    localStorage.setItem('kntt_current_worksheet', JSON.stringify(data));
    onAutoSave?.(data);
    const now = new Date();
    setLastSavedTime(
      `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    );
  }, [data, onAutoSave]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveOnly = () => {
    onSave(data);
    onAutoSave?.(data);
    localStorage.setItem('kntt_current_worksheet', JSON.stringify(data));
    const totalQ = data.part1.length + data.part2.length + data.part3.length + data.part4.length;
    triggerToast(`✓ Đã lưu thành công thông tin chung và ${totalQ} câu hỏi!`);
  };

  const handleSaveAndExit = () => {
    onSave(data);
  };

  // Math symbol insertion handler
  const handleInsertSymbol = (snippet: string) => {
    if (!focusedInputInfo) return;

    const { target, index, subKey } = focusedInputInfo;

    setData((prev) => {
      const copy = { ...prev };
      if (target === 'p1_content' && typeof index === 'number') {
        copy.part1[index].content = (copy.part1[index].content || '') + snippet;
      } else if (target === 'p1_option' && typeof index === 'number' && subKey) {
        copy.part1[index].options[subKey as 'A' | 'B' | 'C' | 'D'] =
          (copy.part1[index].options[subKey as 'A' | 'B' | 'C' | 'D'] || '') + snippet;
      } else if (target === 'p2_content' && typeof index === 'number') {
        copy.part2[index].content = (copy.part2[index].content || '') + snippet;
      } else if (target === 'p2_stmt' && typeof index === 'number' && subKey) {
        const stmtIdx = copy.part2[index].statements.findIndex((s) => s.id === subKey);
        if (stmtIdx !== -1) {
          copy.part2[index].statements[stmtIdx].content =
            (copy.part2[index].statements[stmtIdx].content || '') + snippet;
        }
      } else if (target === 'p3_content' && typeof index === 'number') {
        copy.part3[index].content = (copy.part3[index].content || '') + snippet;
      } else if (target === 'p4_content' && typeof index === 'number') {
        copy.part4[index].content = (copy.part4[index].content || '') + snippet;
      } else if (target === 'p4_solution' && typeof index === 'number') {
        copy.part4[index].solution = (copy.part4[index].solution || '') + snippet;
      }
      return copy;
    });
  };

  // Set Question Count for Part 1
  const handleSetPart1Count = (targetCount: number) => {
    const target = Math.max(1, Math.min(30, targetCount));
    setData((prev) => {
      const current = prev.part1.length;
      if (target === current) return prev;
      if (target > current) {
        const toAdd = target - current;
        const newItems: Part1Question[] = [];
        for (let i = 0; i < toAdd; i++) {
          newItems.push({
            id: `p1_q_${Date.now()}_${i}`,
            code: `Câu ${current + i + 1}`,
            content: 'Nội dung câu hỏi mới... Cho $x = ...$',
            level: 'nhan_biet',
            options: {
              A: 'Phương án A',
              B: 'Phương án B',
              C: 'Phương án C',
              D: 'Phương án D',
            },
            correctAnswer: 'A',
            points: 0.25,
            explanation: 'Hướng dẫn giải chi tiết cho câu hỏi.',
          });
        }
        return { ...prev, part1: [...prev.part1, ...newItems] };
      } else {
        return { ...prev, part1: prev.part1.slice(0, target) };
      }
    });
    triggerToast(`Đã điều chỉnh Phần I thành ${target} câu.`);
  };

  // Set Question Count for Part 2
  const handleSetPart2Count = (targetCount: number) => {
    const target = Math.max(1, Math.min(10, targetCount));
    setData((prev) => {
      const current = prev.part2.length;
      if (target === current) return prev;
      if (target > current) {
        const toAdd = target - current;
        const newItems: Part2Question[] = [];
        for (let i = 0; i < toAdd; i++) {
          newItems.push({
            id: `p2_q_${Date.now()}_${i}`,
            code: `Câu ${current + i + 1}`,
            content: 'Cho biểu thức / hình học... Xét tính Đúng/Sai của các mệnh đề sau:',
            level: 'thong_hieu',
            points: 1.0,
            explanation: 'Lời giải chi tiết.',
            statements: [
              { id: 'a', content: 'Khẳng định a là...', isCorrect: true, explanation: '' },
              { id: 'b', content: 'Khẳng định b là...', isCorrect: false, explanation: '' },
              { id: 'c', content: 'Khẳng định c là...', isCorrect: true, explanation: '' },
              { id: 'd', content: 'Khẳng định d là...', isCorrect: false, explanation: '' },
            ],
          });
        }
        return { ...prev, part2: [...prev.part2, ...newItems] };
      } else {
        return { ...prev, part2: prev.part2.slice(0, target) };
      }
    });
    triggerToast(`Đã điều chỉnh Phần II thành ${target} câu.`);
  };

  // Set Question Count for Part 3
  const handleSetPart3Count = (targetCount: number) => {
    const target = Math.max(1, Math.min(15, targetCount));
    setData((prev) => {
      const current = prev.part3.length;
      if (target === current) return prev;
      if (target > current) {
        const toAdd = target - current;
        const newItems: Part3Question[] = [];
        for (let i = 0; i < toAdd; i++) {
          newItems.push({
            id: `p3_q_${Date.now()}_${i}`,
            code: `Câu ${current + i + 1}`,
            content: 'Tính giá trị của... (Học sinh điền kết quả ngắn)',
            level: 'van_dung',
            correctAnswer: '10',
            acceptableAnswers: ['10'],
            points: 0.5,
            explanation: 'Lời giải chi tiết.',
          });
        }
        return { ...prev, part3: [...prev.part3, ...newItems] };
      } else {
        return { ...prev, part3: prev.part3.slice(0, target) };
      }
    });
    triggerToast(`Đã điều chỉnh Phần III thành ${target} câu.`);
  };

  // Set Question Count for Part 4 (Cho phép chọn từ 0 đến 10 bài)
  const handleSetPart4Count = (targetCount: number) => {
    const target = Math.max(0, Math.min(10, targetCount));
    setData((prev) => {
      const current = prev.part4.length;
      if (target === current) return prev;
      if (target > current) {
        const toAdd = target - current;
        const newItems: Part4Question[] = [];
        for (let i = 0; i < toAdd; i++) {
          newItems.push({
            id: `p4_q_${Date.now()}_${i}`,
            code: `Bài ${current + i + 1}`,
            content: 'Bài toán tự luận: 1) Rút gọn biểu thức... 2) Tìm x...',
            level: 'van_dung',
            points: 2.0,
            rubric: [
              { stepDescription: 'Ý 1: Giải đúng bước đầu', points: 1.0 },
              { stepDescription: 'Ý 2: Kết luận chính xác', points: 1.0 },
            ],
            solution: 'Lời giải mẫu chi tiết từng bước...',
          });
        }
        return { ...prev, part4: [...prev.part4, ...newItems] };
      } else {
        return { ...prev, part4: prev.part4.slice(0, target) };
      }
    });
    triggerToast(
      target === 0
        ? 'Đã chuyển Phần IV thành 0 bài (Không có tự luận).'
        : `Đã điều chỉnh Phần IV thành ${target} bài tự luận (0-10 bài).`
    );
  };

  // Apply quick preset to all 4 parts
  const handleApplyPreset = (p1: number, p2: number, p3: number, p4: number, name: string) => {
    handleSetPart1Count(p1);
    handleSetPart2Count(p2);
    handleSetPart3Count(p3);
    handleSetPart4Count(p4);
    triggerToast(`Đã áp dụng mẫu ${name}: ${p1} TN đơn, ${p2} Đ/S, ${p3} TL ngắn, ${p4} Tự luận.`);
  };

  // Add new question to Part 1
  const handleAddPart1 = () => {
    const newQ: Part1Question = {
      id: `p1_q_${Date.now()}`,
      code: `Câu ${data.part1.length + 1}`,
      content: 'Nội dung câu hỏi mới... Cho $x = ...$',
      level: 'nhan_biet',
      options: {
        A: 'Phương án A',
        B: 'Phương án B',
        C: 'Phương án C',
        D: 'Phương án D',
      },
      correctAnswer: 'A',
      points: 0.25,
      explanation: 'Hướng dẫn giải chi tiết cho câu hỏi.',
    };
    setData((prev) => ({ ...prev, part1: [...prev.part1, newQ] }));
    triggerToast(`Đã thêm câu hỏi vào Phần I.`);
  };

  // Add new question to Part 2
  const handleAddPart2 = () => {
    const newQ: Part2Question = {
      id: `p2_q_${Date.now()}`,
      code: `Câu ${data.part2.length + 1}`,
      content: 'Cho hàm số / hình học / biểu thức... Xét tính Đúng/Sai của các mệnh đề sau:',
      level: 'thong_hieu',
      points: 1.0,
      explanation: 'Lời giải tổng quan cho bài toán.',
      statements: [
        { id: 'a', content: 'Khẳng định a là...', isCorrect: true, explanation: '' },
        { id: 'b', content: 'Khẳng định b là...', isCorrect: false, explanation: '' },
        { id: 'c', content: 'Khẳng định c là...', isCorrect: true, explanation: '' },
        { id: 'd', content: 'Khẳng định d là...', isCorrect: false, explanation: '' },
      ],
    };
    setData((prev) => ({ ...prev, part2: [...prev.part2, newQ] }));
    triggerToast(`Đã thêm câu hỏi vào Phần II.`);
  };

  // Add new question to Part 3
  const handleAddPart3 = () => {
    const newQ: Part3Question = {
      id: `p3_q_${Date.now()}`,
      code: `Câu ${data.part3.length + 1}`,
      content: 'Tính giá trị của... (Học sinh điền kết quả ngắn)',
      level: 'van_dung',
      correctAnswer: '10',
      acceptableAnswers: ['10'],
      points: 0.5,
      explanation: 'Lời giải chi tiết.',
    };
    setData((prev) => ({ ...prev, part3: [...prev.part3, newQ] }));
    triggerToast(`Đã thêm câu hỏi vào Phần III.`);
  };

  // Add new question to Part 4 (tối đa 10 bài)
  const handleAddPart4 = () => {
    if (data.part4.length >= 10) {
      triggerToast('Phần tự luận đã đạt mức tối đa 10 bài.');
      return;
    }
    const newQ: Part4Question = {
      id: `p4_q_${Date.now()}`,
      code: `Bài ${data.part4.length + 1}`,
      content: 'Bài toán tự luận: 1) Rút gọn... 2) Tìm x...',
      level: 'van_dung',
      points: 2.0,
      rubric: [
        { stepDescription: 'Ý 1: Giải đúng bước đầu', points: 1.0 },
        { stepDescription: 'Ý 2: Kết luận chính xác', points: 1.0 },
      ],
      solution: 'Lời giải mẫu chi tiết từng bước...',
    };
    setData((prev) => ({ ...prev, part4: [...prev.part4, newQ] }));
    triggerToast(`Đã thêm bài tự luận vào Phần IV (${data.part4.length + 1}/10 bài).`);
  };

  const totalQuestions =
    data.part1.length + data.part2.length + data.part3.length + data.part4.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>✏️ Biên Soạn Phiếu Bài Tập</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Chuẩn CV 7991
            </span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Chỉnh sửa thông tin chung, ma trận số câu và nội dung bài học</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đã tự động lưu lúc {lastSavedTime}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSaveOnly}
            className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition"
          >
            Lưu tại chỗ
          </button>
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Xem đề</span>
          </button>
        </div>
      </div>

      {/* Floating Math Symbol Picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <MathSymbolPicker onInsert={handleInsertSymbol} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Thông tin chung & Số câu ({totalQuestions})</span>
        </button>
        <button
          onClick={() => setActiveTab('part1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'part1'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Phần I: Nhiều lựa chọn ({data.part1.length})
        </button>
        <button
          onClick={() => setActiveTab('part2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'part2'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Phần II: Đúng / Sai ({data.part2.length})
        </button>
        <button
          onClick={() => setActiveTab('part3')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'part3'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Phần III: Trả lời ngắn ({data.part3.length})
        </button>
        <button
          onClick={() => setActiveTab('part4')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'part4'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Phần IV: Tự luận ({data.part4.length})
        </button>
      </div>

      {/* TAB: THÔNG TIN CHUNG & SỐ LƯỢNG CÂU HỎI Ở CẢ 4 PHẦN */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Card 1: Quản lý số lượng câu hỏi ở cả 4 phần */}
          <div className="bg-white rounded-2xl border border-indigo-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Quản Lý Số Lượng Câu Hỏi Cả 4 Phần
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tăng giảm số câu cho từng phần hoặc áp dụng mẫu ma trận đề thi chuẩn CV 7991
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs border border-indigo-200">
                  Tổng cộng: {totalQuestions} câu hỏi
                </span>
                <button
                  type="button"
                  onClick={handleSaveOnly}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu số lượng câu hỏi</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500">Áp dụng mẫu nhanh:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(4, 1, 2, 1, '15 phút')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                Đề 15 phút (4-1-2-1)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(8, 2, 4, 1, 'Giữa kỳ 45 phút')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                Đề Giữa kỳ 45p (8-2-4-1)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(12, 4, 6, 2, 'Học kỳ 60-90 phút')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                Đề Học kỳ 60-90p (12-4-6-2)
              </button>
            </div>

            {/* 4 Interactive Part Steppers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Part 1 */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900">Phần I: TN Đơn</span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      0.25đ/câu
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">4 lựa chọn A, B, C, D</p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl border border-blue-200">
                  <button
                    type="button"
                    onClick={() => handleSetPart1Count(data.part1.length - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-slate-900">
                    {data.part1.length} câu
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetPart1Count(data.part1.length + 1)}
                    className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Part 2 */}
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-900">Phần II: Đúng / Sai</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      1.0đ/câu
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Mỗi câu có 4 ý a,b,c,d</p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl border border-emerald-200">
                  <button
                    type="button"
                    onClick={() => handleSetPart2Count(data.part2.length - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-slate-900">
                    {data.part2.length} câu
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetPart2Count(data.part2.length + 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Part 3 */}
              <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-purple-900">Phần III: TL Ngắn</span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      0.5đ/câu
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Điền đáp số ngắn</p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl border border-purple-200">
                  <button
                    type="button"
                    onClick={() => handleSetPart3Count(data.part3.length - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-slate-900">
                    {data.part3.length} câu
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetPart3Count(data.part3.length + 1)}
                    className="w-7 h-7 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Part 4 (Cho phép chọn từ 0 đến 10 câu) */}
              <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-900">Phần IV: Tự luận</span>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      0 - 10 bài
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {data.part4.length === 0 ? 'Đề không có tự luận (0 bài)' : 'Kèm Rubric chấm điểm'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl border border-rose-200">
                  <button
                    type="button"
                    onClick={() => handleSetPart4Count(data.part4.length - 1)}
                    disabled={data.part4.length <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center font-bold"
                    title="Giảm số bài tự luận"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-slate-900">
                    {data.part4.length === 0 ? '0 bài' : `${data.part4.length} bài`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetPart4Count(data.part4.length + 1)}
                    disabled={data.part4.length >= 10}
                    className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 disabled:opacity-40 text-rose-800 flex items-center justify-center font-bold"
                    title="Tăng số bài tự luận (tối đa 10)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Thông tin hành chính phiếu bài tập */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Thông Tin Hành Chính Đề Thi
              </h3>
              <button
                type="button"
                onClick={handleSaveOnly}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông tin</span>
              </button>
            </div>

            {/* Grade Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Khối lớp:</label>
              <div className="grid grid-cols-4 gap-2">
                {([6, 7, 8, 9] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        metadata: { ...prev.metadata, grade: g },
                      }))
                    }
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      data.metadata.grade === g
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Toán {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề phiếu:</label>
                <input
                  type="text"
                  value={data.metadata.title}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, title: e.target.value },
                    }))
                  }
                  placeholder="VD: Phiếu Bài Tập Toán 8 - Đa Thức"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề / Bài học:</label>
                <input
                  type="text"
                  value={data.metadata.topic}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, topic: e.target.value },
                    }))
                  }
                  placeholder="VD: Chương I. Đa thức & Hằng đẳng thức đáng nhớ"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường / Đơn vị:</label>
                <input
                  type="text"
                  value={data.metadata.schoolName}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, schoolName: e.target.value },
                    }))
                  }
                  placeholder="VD: Trường THCS Chuẩn Quốc Gia"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Năm học:</label>
                <input
                  type="text"
                  value={data.metadata.academicYear}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, academicYear: e.target.value },
                    }))
                  }
                  placeholder="VD: 2025 - 2026"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thời gian làm bài (phút):
                </label>
                <input
                  type="number"
                  value={data.metadata.durationMinutes}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, durationMinutes: Number(e.target.value) },
                    }))
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tác giả / Giáo viên biên soạn:
                </label>
                <input
                  type="text"
                  value={data.metadata.author}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, author: e.target.value },
                    }))
                  }
                  placeholder="VD: Thầy Nguyễn Văn A"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú / Mô tả đề:</label>
              <textarea
                rows={2}
                value={data.metadata.description || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    metadata: { ...prev.metadata, description: e.target.value },
                  }))
                }
                placeholder="VD: Phiếu bài tập tự luyện cuối tuần chuẩn cấu trúc CV 7991/BGDĐT"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveOnly}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thông tin đề</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
              >
                <span>Lưu & Xem đề</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PHẦN I (Nhiều lựa chọn) */}
      {activeTab === 'part1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Phần I: Câu hỏi trắc nghiệm nhiều phương án lựa chọn (A, B, C, D)
            </h3>
            <button
              type="button"
              onClick={handleAddPart1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi</span>
            </button>
          </div>

          <div className="space-y-6">
            {data.part1.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={q.code}
                      onChange={(e) => {
                        const copy = [...data.part1];
                        copy[idx].code = e.target.value;
                        setData({ ...data, part1: copy });
                      }}
                      className="w-20 px-2 py-1 font-bold text-xs border border-slate-300 rounded"
                    />
                    <select
                      value={q.level}
                      onChange={(e) => {
                        const copy = [...data.part1];
                        copy[idx].level = e.target.value as CognitiveLevel;
                        setData({ ...data, part1: copy });
                      }}
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="nhan_biet">Nhận biết</option>
                      <option value="thong_hieu">Thông hiểu</option>
                      <option value="van_dung">Vận dụng</option>
                      <option value="van_dung_cao">Vận dụng cao</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Điểm:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={q.points}
                      onChange={(e) => {
                        const copy = [...data.part1];
                        copy[idx].points = Number(e.target.value);
                        setData({ ...data, part1: copy });
                      }}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = data.part1.filter((_, i) => i !== idx);
                        setData({ ...data, part1: copy });
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Xóa câu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu hỏi:</label>
                  <textarea
                    rows={2}
                    value={q.content}
                    onFocus={() => setFocusedInputInfo({ target: 'p1_content', index: idx })}
                    onChange={(e) => {
                      const copy = [...data.part1];
                      copy[idx].content = e.target.value;
                      setData({ ...data, part1: copy });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-sans text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Xem trước công thức:
                    </span>
                    <MathRenderer content={q.content} />
                  </div>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <div key={opt} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Phương án {opt}:</label>
                        <label className="flex items-center gap-1 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct_p1_${idx}`}
                            checked={q.correctAnswer === opt}
                            onChange={() => {
                              const copy = [...data.part1];
                              copy[idx].correctAnswer = opt;
                              setData({ ...data, part1: copy });
                            }}
                          />
                          <span className={q.correctAnswer === opt ? 'font-bold text-emerald-600' : ''}>
                            Đúng
                          </span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={q.options[opt]}
                        onFocus={() =>
                          setFocusedInputInfo({ target: 'p1_option', index: idx, subKey: opt })
                        }
                        onChange={(e) => {
                          const copy = [...data.part1];
                          copy[idx].options[opt] = e.target.value;
                          setData({ ...data, part1: copy });
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hướng dẫn giải / Lời giải chi tiết:
                  </label>
                  <textarea
                    rows={2}
                    value={q.explanation}
                    onChange={(e) => {
                      const copy = [...data.part1];
                      copy[idx].explanation = e.target.value;
                      setData({ ...data, part1: copy });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PHẦN II (Đúng / Sai) */}
      {activeTab === 'part2' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Phần II: Câu hỏi trắc nghiệm Đúng / Sai (Mỗi câu gồm 4 ý a, b, c, d)
            </h3>
            <button
              type="button"
              onClick={handleAddPart2}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi Đúng/Sai</span>
            </button>
          </div>

          <div className="space-y-6">
            {data.part2.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={q.code}
                      onChange={(e) => {
                        const copy = [...data.part2];
                        copy[idx].code = e.target.value;
                        setData({ ...data, part2: copy });
                      }}
                      className="w-20 px-2 py-1 font-bold text-xs border border-slate-300 rounded"
                    />
                    <select
                      value={q.level}
                      onChange={(e) => {
                        const copy = [...data.part2];
                        copy[idx].level = e.target.value as CognitiveLevel;
                        setData({ ...data, part2: copy });
                      }}
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="nhan_biet">Nhận biết</option>
                      <option value="thong_hieu">Thông hiểu</option>
                      <option value="van_dung">Vận dụng</option>
                      <option value="van_dung_cao">Vận dụng cao</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Điểm:</span>
                    <input
                      type="number"
                      step="0.1"
                      value={q.points}
                      onChange={(e) => {
                        const copy = [...data.part2];
                        copy[idx].points = Number(e.target.value);
                        setData({ ...data, part2: copy });
                      }}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = data.part2.filter((_, i) => i !== idx);
                        setData({ ...data, part2: copy });
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Xóa câu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question context */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đề bài / Bối cảnh câu hỏi:
                  </label>
                  <textarea
                    rows={2}
                    value={q.content}
                    onFocus={() => setFocusedInputInfo({ target: 'p2_content', index: idx })}
                    onChange={(e) => {
                      const copy = [...data.part2];
                      copy[idx].content = e.target.value;
                      setData({ ...data, part2: copy });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Xem trước công thức:
                    </span>
                    <MathRenderer content={q.content} />
                  </div>
                </div>

                {/* 4 Statements */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">4 Ý mệnh đề (a, b, c, d):</label>
                  {q.statements.map((stmt, sIdx) => (
                    <div key={stmt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-indigo-700 text-xs">Ý {stmt.id})</span>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`p2_${idx}_stmt_${stmt.id}`}
                              checked={stmt.isCorrect === true}
                              onChange={() => {
                                const copy = [...data.part2];
                                copy[idx].statements[sIdx].isCorrect = true;
                                setData({ ...data, part2: copy });
                              }}
                            />
                            <span className={stmt.isCorrect ? 'font-bold text-emerald-600' : ''}>
                              Đúng
                            </span>
                          </label>
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name={`p2_${idx}_stmt_${stmt.id}`}
                              checked={stmt.isCorrect === false}
                              onChange={() => {
                                const copy = [...data.part2];
                                copy[idx].statements[sIdx].isCorrect = false;
                                setData({ ...data, part2: copy });
                              }}
                            />
                            <span className={!stmt.isCorrect ? 'font-bold text-rose-600' : ''}>
                              Sai
                            </span>
                          </label>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={stmt.content}
                        onFocus={() =>
                          setFocusedInputInfo({ target: 'p2_stmt', index: idx, subKey: stmt.id })
                        }
                        onChange={(e) => {
                          const copy = [...data.part2];
                          copy[idx].statements[sIdx].content = e.target.value;
                          setData({ ...data, part2: copy });
                        }}
                        placeholder="Nội dung mệnh đề..."
                        className="w-full p-2 bg-white border border-slate-300 rounded text-sm text-slate-900"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lời giải tổng quan:
                  </label>
                  <textarea
                    rows={2}
                    value={q.explanation}
                    onChange={(e) => {
                      const copy = [...data.part2];
                      copy[idx].explanation = e.target.value;
                      setData({ ...data, part2: copy });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PHẦN III (Trả lời ngắn) */}
      {activeTab === 'part3' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Phần III: Câu hỏi trắc nghiệm trả lời ngắn
            </h3>
            <button
              type="button"
              onClick={handleAddPart3}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu trả lời ngắn</span>
            </button>
          </div>

          <div className="space-y-6">
            {data.part3.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={q.code}
                      onChange={(e) => {
                        const copy = [...data.part3];
                        copy[idx].code = e.target.value;
                        setData({ ...data, part3: copy });
                      }}
                      className="w-20 px-2 py-1 font-bold text-xs border border-slate-300 rounded"
                    />
                    <select
                      value={q.level}
                      onChange={(e) => {
                        const copy = [...data.part3];
                        copy[idx].level = e.target.value as CognitiveLevel;
                        setData({ ...data, part3: copy });
                      }}
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="nhan_biet">Nhận biết</option>
                      <option value="thong_hieu">Thông hiểu</option>
                      <option value="van_dung">Vận dụng</option>
                      <option value="van_dung_cao">Vận dụng cao</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Điểm:</span>
                    <input
                      type="number"
                      step="0.1"
                      value={q.points}
                      onChange={(e) => {
                        const copy = [...data.part3];
                        copy[idx].points = Number(e.target.value);
                        setData({ ...data, part3: copy });
                      }}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = data.part3.filter((_, i) => i !== idx);
                        setData({ ...data, part3: copy });
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Xóa câu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung câu hỏi:</label>
                  <textarea
                    rows={2}
                    value={q.content}
                    onFocus={() => setFocusedInputInfo({ target: 'p3_content', index: idx })}
                    onChange={(e) => {
                      const copy = [...data.part3];
                      copy[idx].content = e.target.value;
                      setData({ ...data, part3: copy });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                  <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Xem trước công thức:
                    </span>
                    <MathRenderer content={q.content} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đáp số chuẩn:
                    </label>
                    <input
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const copy = [...data.part3];
                        copy[idx].correctAnswer = e.target.value;
                        setData({ ...data, part3: copy });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị (nếu có):</label>
                    <input
                      type="text"
                      value={q.unit || ''}
                      placeholder="cm, cm², độ, m/s..."
                      onChange={(e) => {
                        const copy = [...data.part3];
                        copy[idx].unit = e.target.value;
                        setData({ ...data, part3: copy });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hướng dẫn giải:
                  </label>
                  <textarea
                    rows={2}
                    value={q.explanation}
                    onChange={(e) => {
                      const copy = [...data.part3];
                      copy[idx].explanation = e.target.value;
                      setData({ ...data, part3: copy });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PHẦN IV (Tự luận) */}
      {activeTab === 'part4' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Phần IV: Bài tập tự luận</h3>
              <p className="text-xs text-slate-500">
                Cho phép chọn từ 0 đến 10 bài tự luận (Hiện tại: <strong className="text-rose-700">{data.part4.length}/10 bài</strong>)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {data.part4.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPart4Count(0)}
                  className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold transition"
                >
                  Xóa hết tự luận (Về 0 bài)
                </button>
              )}
              <button
                type="button"
                onClick={handleAddPart4}
                disabled={data.part4.length >= 10}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài tự luận ({data.part4.length}/10)</span>
              </button>
            </div>
          </div>

          {data.part4.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto font-black text-base border border-rose-100">
                0
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Đề thi hiện tại không có phần tự luận (0 bài)
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bạn có thể giữ đề thi 100% trắc nghiệm khách quan, hoặc bấm nút bên dưới để thêm bài tự luận (cho phép từ 0 đến 10 bài).
              </p>
              <button
                type="button"
                onClick={handleAddPart4}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài tự luận đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {data.part4.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={q.code}
                      onChange={(e) => {
                        const copy = [...data.part4];
                        copy[idx].code = e.target.value;
                        setData({ ...data, part4: copy });
                      }}
                      className="w-20 px-2 py-1 font-bold text-xs border border-slate-300 rounded"
                    />
                    <select
                      value={q.level}
                      onChange={(e) => {
                        const copy = [...data.part4];
                        copy[idx].level = e.target.value as CognitiveLevel;
                        setData({ ...data, part4: copy });
                      }}
                      className="text-xs border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="thong_hieu">Thông hiểu</option>
                      <option value="van_dung">Vận dụng</option>
                      <option value="van_dung_cao">Vận dụng cao</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Tổng điểm:</span>
                    <input
                      type="number"
                      step="0.25"
                      value={q.points}
                      onChange={(e) => {
                        const copy = [...data.part4];
                        copy[idx].points = Number(e.target.value);
                        setData({ ...data, part4: copy });
                      }}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = data.part4.filter((_, i) => i !== idx);
                        setData({ ...data, part4: copy });
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Xóa bài này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đề bài tự luận:</label>
                  <textarea
                    rows={3}
                    value={q.content}
                    onFocus={() => setFocusedInputInfo({ target: 'p4_content', index: idx })}
                    onChange={(e) => {
                      const copy = [...data.part4];
                      copy[idx].content = e.target.value;
                      setData({ ...data, part4: copy });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                  <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Xem trước công thức:
                    </span>
                    <MathRenderer content={q.content} />
                  </div>
                </div>

                {/* Rubric steps */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Các bước chấm điểm (Rubric):</label>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...data.part4];
                        copy[idx].rubric.push({ stepDescription: 'Bước mới...', points: 0.5 });
                        setData({ ...data, part4: copy });
                      }}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      + Thêm bước
                    </button>
                  </div>
                  {q.rubric.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={r.stepDescription}
                        onChange={(e) => {
                          const copy = [...data.part4];
                          copy[idx].rubric[rIdx].stepDescription = e.target.value;
                          setData({ ...data, part4: copy });
                        }}
                        className="flex-1 p-1.5 border border-slate-300 rounded text-xs text-slate-900"
                        placeholder="Mô tả tiêu chí/bước giải..."
                      />
                      <input
                        type="number"
                        step="0.25"
                        value={r.points}
                        onChange={(e) => {
                          const copy = [...data.part4];
                          copy[idx].rubric[rIdx].points = Number(e.target.value);
                          setData({ ...data, part4: copy });
                        }}
                        className="w-16 p-1.5 border border-slate-300 rounded text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...data.part4];
                          copy[idx].rubric = copy[idx].rubric.filter((_, i) => i !== rIdx);
                          setData({ ...data, part4: copy });
                        }}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Solution */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lời giải mẫu chi tiết:
                  </label>
                  <textarea
                    rows={4}
                    value={q.solution}
                    onFocus={() => setFocusedInputInfo({ target: 'p4_solution', index: idx })}
                    onChange={(e) => {
                      const copy = [...data.part4];
                      copy[idx].solution = e.target.value;
                      setData({ ...data, part4: copy });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 font-serif"
                  />
                  <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Xem trước lời giải:
                    </span>
                    <MathRenderer content={q.solution} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 sm:px-8 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Tự động lưu lúc {lastSavedTime}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-900">Ma trận đề:</span>
            <span>P.I: <strong>{data.part1.length}</strong></span>
            <span>•</span>
            <span>P.II: <strong>{data.part2.length}</strong></span>
            <span>•</span>
            <span>P.III: <strong>{data.part3.length}</strong></span>
            <span>•</span>
            <span>P.IV: <strong>{data.part4.length}</strong></span>
            <span>•</span>
            <span className="text-indigo-700 font-extrabold">Tổng: {totalQuestions} câu</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSaveOnly}
            className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition"
          >
            Lưu tại chỗ
          </button>
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi & Xem đề</span>
          </button>
        </div>
      </div>
    </div>
  );
};
