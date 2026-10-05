import React, { useState } from 'react';
import { Worksheet } from '../types/worksheet';
import { MathRenderer } from './MathRenderer';
import { Printer, ArrowLeft, CheckSquare, Square } from 'lucide-react';

interface PrintWorksheetProps {
  worksheet: Worksheet;
  onExit: () => void;
}

export const PrintWorksheet: React.FC<PrintWorksheetProps> = ({ worksheet, onExit }) => {
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Control bar (hidden during print) */}
      <div className="no-print max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <span className="font-bold text-slate-800 text-sm">Chế độ In ấn & Xuất bản A4</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <button
              type="button"
              onClick={() => setIncludeAnswerKey(!includeAnswerKey)}
              className="text-indigo-600 focus:outline-hidden"
            >
              {includeAnswerKey ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <span>In kèm Đáp án & Hướng dẫn chấm (Dành cho GV)</span>
          </label>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <Printer className="w-4 h-4" />
            <span>In ngay (Print A4)</span>
          </button>
        </div>
      </div>

      {/* A4 Paper Document Container */}
      <div className="max-w-[210mm] mx-auto bg-white border border-slate-300 shadow-lg p-8 sm:p-12 text-black print:border-none print:shadow-none print:p-0 font-serif leading-relaxed">
        {/* Header School & Exam Title */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-black">
          <div className="text-center font-bold text-xs uppercase tracking-wide">
            <p>{worksheet.metadata.schoolName}</p>
            <p className="mt-0.5 text-[11px] font-normal">TỔ BỘ MÔN TOÁN THCS</p>
            <div className="w-20 h-0.5 bg-black mx-auto mt-1" />
          </div>

          <div className="text-center">
            <h1 className="font-bold text-sm uppercase tracking-wide">
              {worksheet.metadata.title}
            </h1>
            <p className="text-xs font-semibold mt-0.5">
              MÔN: TOÁN - KHỐI {worksheet.metadata.grade}
            </p>
            <p className="text-[11px] italic">
              Thời gian làm bài: {worksheet.metadata.durationMinutes} phút (không kể phát đề)
            </p>
          </div>
        </div>

        {/* Student Information and Score Box */}
        <div className="grid grid-cols-3 gap-2 my-4 border border-black p-3 text-xs">
          <div className="col-span-2 space-y-1.5">
            <p>
              Họ và tên học sinh: <span className="font-mono font-bold">...........................................................................</span>
            </p>
            <div className="flex justify-between">
              <p>
                Lớp: <span className="font-mono font-bold">............</span>
              </p>
              <p>
                Số báo danh / Mã số: <span className="font-mono font-bold">............</span>
              </p>
              <p>
                Phòng thi: <span className="font-mono font-bold">............</span>
              </p>
            </div>
          </div>
          <div className="border-l border-black pl-3 flex flex-col justify-between">
            <p className="font-bold text-center">ĐIỂM SỐ</p>
            <p className="text-[10px] text-center italic text-slate-500">Lời phê của giáo viên</p>
          </div>
        </div>

        {/* PHIẾU TRẢ LỜI TRẮC NGHIỆM CHUẨN CÔNG VĂN 7991 (Print only or student blank form) */}
        <div className="mb-6 p-3 border border-black rounded-xs text-[11px]">
          <p className="font-bold text-center uppercase tracking-wider mb-2 text-xs">
            PHIẾU TRẢ LỜI TRẮC NGHIỆM (CHUẨN CV 7991)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Phần I Answer Bubble Grid */}
            <div className="border border-slate-300 p-2">
              <p className="font-bold text-[10px] uppercase text-center mb-1 bg-slate-100 py-0.5">
                Phần I: Nhiều lựa chọn
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {worksheet.part1.map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <span className="font-bold w-5">{idx + 1}.</span>
                    <div className="flex gap-1">
                      {['A', 'B', 'C', 'D'].map((c) => (
                        <span
                          key={c}
                          className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-[8px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần II Answer Bubble Grid (Đúng / Sai) */}
            <div className="border border-slate-300 p-2">
              <p className="font-bold text-[10px] uppercase text-center mb-1 bg-slate-100 py-0.5">
                Phần II: Đúng / Sai
              </p>
              <div className="space-y-1.5 text-[10px]">
                {worksheet.part2.map((_, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-1">
                    <span className="font-bold">Câu {idx + 1}:</span>
                    <div className="grid grid-cols-4 gap-1 mt-0.5">
                      {['a', 'b', 'c', 'd'].map((ch) => (
                        <div key={ch} className="flex items-center gap-0.5 justify-center">
                          <span>{ch})</span>
                          <span className="w-3 h-3 border border-black rounded-xs flex items-center justify-center text-[7px]">
                            Đ
                          </span>
                          <span className="w-3 h-3 border border-black rounded-xs flex items-center justify-center text-[7px]">
                            S
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phần III Answer Grid (Trả lời ngắn) */}
            <div className="border border-slate-300 p-2">
              <p className="font-bold text-[10px] uppercase text-center mb-1 bg-slate-100 py-0.5">
                Phần III: Trả lời ngắn
              </p>
              <div className="space-y-1 text-[10px]">
                {worksheet.part3.map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-bold">Câu {idx + 1}:</span>
                    <div className="w-24 h-4 border-b border-dashed border-black" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NỘI DUNG ĐỀ THI */}
        <div className="space-y-6">
          {/* PHẦN I */}
          <div>
            <div className="font-bold text-xs uppercase mb-2">
              PHẦN I. Câu hỏi trắc nghiệm nhiều phương án lựa chọn.
              <span className="font-normal italic lowercase ml-2">
                (Thí sinh trả lời từ câu 1 đến câu {worksheet.part1.length}. Mỗi câu hỏi chỉ chọn một phương án).
              </span>
            </div>
            <div className="space-y-3 text-xs pl-2">
              {worksheet.part1.map((q, idx) => (
                <div key={q.id} className="page-break-inside-avoid">
                  <p className="font-semibold">
                    <span className="font-bold">{q.code || `Câu ${idx + 1}`}: </span>
                    <MathRenderer content={q.content} />
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1 pl-4">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div key={opt} className="flex items-start gap-1">
                        <span className="font-bold">{opt}.</span>
                        <MathRenderer content={q.options[opt]} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN II */}
          <div>
            <div className="font-bold text-xs uppercase mb-2">
              PHẦN II. Câu hỏi trắc nghiệm Đúng / Sai.
              <span className="font-normal italic lowercase ml-2">
                (Thí sinh trả lời từ câu 1 đến câu {worksheet.part2.length}. Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai).
              </span>
            </div>
            <div className="space-y-4 text-xs pl-2">
              {worksheet.part2.map((q, idx) => (
                <div key={q.id} className="page-break-inside-avoid">
                  <p className="font-semibold">
                    <span className="font-bold">{q.code || `Câu ${idx + 1}`}: </span>
                    <MathRenderer content={q.content} />
                  </p>
                  <div className="space-y-1 mt-1 pl-4">
                    {q.statements.map((stmt) => (
                      <div key={stmt.id} className="flex items-start gap-2">
                        <span className="font-bold">{stmt.id})</span>
                        <div className="flex-1">
                          <MathRenderer content={stmt.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN III */}
          <div>
            <div className="font-bold text-xs uppercase mb-2">
              PHẦN III. Câu hỏi trắc nghiệm trả lời ngắn.
              <span className="font-normal italic lowercase ml-2">
                (Thí sinh trả lời từ câu 1 đến câu {worksheet.part3.length}. Điền kết quả vào ô tương ứng).
              </span>
            </div>
            <div className="space-y-3 text-xs pl-2">
              {worksheet.part3.map((q, idx) => (
                <div key={q.id} className="page-break-inside-avoid flex items-baseline justify-between gap-4">
                  <div className="flex-1">
                    <span className="font-bold">{q.code || `Câu ${idx + 1}`}: </span>
                    <MathRenderer content={q.content} />
                  </div>
                  <div className="w-24 text-right font-mono text-slate-400">Đáp số: .......</div>
                </div>
              ))}
            </div>
          </div>

          {/* PHẦN IV */}
          {worksheet.part4.length > 0 && (
            <div>
              <div className="font-bold text-xs uppercase mb-2">
                PHẦN IV. Tự luận.
                <span className="font-normal italic lowercase ml-2">
                  (Thí sinh trình bày chi tiết lời giải vào giấy làm bài).
                </span>
              </div>
              <div className="space-y-4 text-xs pl-2">
                {worksheet.part4.map((q, idx) => (
                  <div key={q.id} className="page-break-inside-avoid">
                    <p className="font-semibold">
                      <span className="font-bold">{q.code || `Bài ${idx + 1}`}: </span>
                      <span className="font-normal">({q.points} điểm) </span>
                      <MathRenderer content={q.content} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-xs italic pt-4 border-t border-slate-300">
            --- HẾT ---
          </div>
        </div>

        {/* HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN (Dành cho Giáo viên khi tick chọn includeAnswerKey) */}
        {includeAnswerKey && (
          <div className="page-break-after mt-12 pt-8 border-t-2 border-black space-y-6">
            <div className="text-center font-bold text-sm uppercase">
              HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT
              <p className="text-xs font-normal italic mt-0.5">
                (Kèm theo đề kiểm tra Toán {worksheet.metadata.grade} - Chuẩn CV 7991)
              </p>
            </div>

            {/* Đáp án Phần I */}
            <div>
              <p className="font-bold text-xs uppercase bg-slate-100 p-1">
                Phần I: Đáp án trắc nghiệm nhiều phương án lựa chọn (Mỗi câu 0.25đ)
              </p>
              <div className="grid grid-cols-6 gap-2 text-xs mt-2 border p-2">
                {worksheet.part1.map((q, idx) => (
                  <div key={q.id} className="text-center border p-1 rounded">
                    <span className="font-bold block">{idx + 1}</span>
                    <span className="font-bold text-indigo-700">{q.correctAnswer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Đáp án Phần II */}
            <div>
              <p className="font-bold text-xs uppercase bg-slate-100 p-1">
                Phần II: Đáp án câu hỏi Đúng / Sai
              </p>
              <div className="space-y-2 mt-2 text-xs">
                {worksheet.part2.map((q, idx) => (
                  <div key={q.id} className="border p-2 rounded">
                    <p className="font-bold">Câu {idx + 1}:</p>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {q.statements.map((s) => (
                        <div key={s.id} className="flex justify-between border-b pb-1">
                          <span>{s.id})</span>
                          <span className={`font-bold ${s.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {s.isCorrect ? 'Đúng' : 'Sai'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Đáp án Phần III */}
            <div>
              <p className="font-bold text-xs uppercase bg-slate-100 p-1">
                Phần III: Đáp án câu hỏi trả lời ngắn (Mỗi câu 0.5đ)
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                {worksheet.part3.map((q, idx) => (
                  <div key={q.id} className="border p-2 rounded">
                    <span className="font-bold">Câu {idx + 1}: </span>
                    <span className="font-mono font-bold text-purple-700">
                      {q.correctAnswer} {q.unit || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hướng dẫn chấm Phần IV Tự luận */}
            {worksheet.part4.length > 0 && (
              <div>
                <p className="font-bold text-xs uppercase bg-slate-100 p-1">
                  Phần IV: Thang điểm & Lời giải tự luận
                </p>
                <div className="space-y-4 mt-2 text-xs">
                  {worksheet.part4.map((q, idx) => (
                    <div key={q.id} className="border p-3 rounded space-y-2">
                      <p className="font-bold">
                        {q.code || `Bài ${idx + 1}`} ({q.points} điểm):
                      </p>
                      <div className="space-y-1 pl-2">
                        <p className="font-bold text-slate-700">Thang điểm từng bước:</p>
                        {q.rubric.map((r, rIdx) => (
                          <div key={rIdx} className="flex justify-between gap-4 border-b pb-1">
                            <MathRenderer content={r.stepDescription} />
                            <span className="font-bold">{r.points}đ</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pl-2">
                        <p className="font-bold text-slate-700">Lời giải chi tiết:</p>
                        <div className="p-2 bg-slate-50 rounded text-slate-800">
                          <MathRenderer content={q.solution} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
