import React, { useState } from 'react';
import { Worksheet, COGNITIVE_LEVEL_LABELS } from '../types/worksheet';
import { MathRenderer } from './MathRenderer';
import {
  Clock,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Printer,
  Edit,
  Award,
  BookOpen,
} from 'lucide-react';

interface WorksheetViewerProps {
  worksheet: Worksheet;
  onStartPractice: () => void;
  onStartEdit: () => void;
  onPrint: () => void;
}

export const WorksheetViewer: React.FC<WorksheetViewerProps> = ({
  worksheet,
  onStartPractice,
  onStartEdit,
  onPrint,
}) => {
  const [showSolutions, setShowSolutions] = useState(false);

  const totalPoints =
    worksheet.part1.reduce((sum, q) => sum + q.points, 0) +
    worksheet.part2.reduce((sum, q) => sum + q.points, 0) +
    worksheet.part3.reduce((sum, q) => sum + q.points, 0) +
    worksheet.part4.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>{worksheet.metadata.schoolName}</span>
              <span>•</span>
              <span>Năm học {worksheet.metadata.academicYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {worksheet.metadata.title}
            </h1>
            <p className="text-slate-600 text-sm mt-1">{worksheet.metadata.topic}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSolutions(!showSolutions)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                showSolutions
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {showSolutions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSolutions ? 'Ẩn lời giải' : 'Xem đáp án & lời giải'}</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>In ấn / PDF</span>
            </button>

            <button
              onClick={onStartEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Edit className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>

            <button
              onClick={onStartPractice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Bắt đầu làm bài</span>
            </button>
          </div>
        </div>

        {/* Quick specs pill bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Khối lớp</p>
              <p className="text-sm font-bold text-slate-800">Toán Lớp {worksheet.metadata.grade}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Thời gian</p>
              <p className="text-sm font-bold text-slate-800">{worksheet.metadata.durationMinutes} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng thang điểm</p>
              <p className="text-sm font-bold text-slate-800">{totalPoints.toFixed(2)} điểm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Cấu trúc</p>
              <p className="text-sm font-bold text-slate-800">Chuẩn CV 7991</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu trúc Công văn 7991 Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5">
        <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
          <span>📋 Cấu trúc bài kiểm tra đánh giá định kỳ theo Công văn 7991/BGDĐT:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-xs text-slate-700">
          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="font-bold text-blue-700 block mb-0.5">Phần I: Nhiều lựa chọn</span>
            4 lựa chọn A, B, C, D ({worksheet.part1.length} câu •{' '}
            {worksheet.part1.reduce((s, q) => s + q.points, 0).toFixed(2)} đ)
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="font-bold text-blue-700 block mb-0.5">Phần II: Đúng / Sai</span>
            Mỗi câu 4 ý a, b, c, d ({worksheet.part2.length} câu •{' '}
            {worksheet.part2.reduce((s, q) => s + q.points, 0).toFixed(2)} đ)
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="font-bold text-blue-700 block mb-0.5">Phần III: Trả lời ngắn</span>
            Tự điền đáp số ({worksheet.part3.length} câu •{' '}
            {worksheet.part3.reduce((s, q) => s + q.points, 0).toFixed(2)} đ)
          </div>
          <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
            <span className="font-bold text-blue-700 block mb-0.5">Phần IV: Tự luận</span>
            Trình bày giải toán ({worksheet.part4.length} bài •{' '}
            {worksheet.part4.reduce((s, q) => s + q.points, 0).toFixed(2)} đ)
          </div>
        </div>
      </div>

      {/* PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                I
              </span>
              <span>PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {worksheet.part1.length} câu • {worksheet.part1.reduce((s, q) => s + q.points, 0).toFixed(2)} điểm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            Thí sinh trả lời từ câu 1 đến câu {worksheet.part1.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
          </p>
        </div>

        <div className="space-y-6 pt-2">
          {worksheet.part1.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-indigo-700 text-sm whitespace-nowrap">
                    {q.code || `Câu ${idx + 1}`}:
                  </span>
                  <div className="text-sm font-medium text-slate-800">
                    <MathRenderer content={q.content} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                    {COGNITIVE_LEVEL_LABELS[q.level]}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                    {q.points} đ
                  </span>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-4 sm:pl-6">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const isCorrect = q.correctAnswer === optKey;
                  return (
                    <div
                      key={optKey}
                      className={`p-2.5 rounded-lg border text-sm flex items-start gap-2 transition ${
                        showSolutions && isCorrect
                          ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          showSolutions && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optKey}
                      </span>
                      <div className="flex-1">
                        <MathRenderer content={q.options[optKey]} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              {showSolutions && (
                <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-amber-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đáp án đúng: {q.correctAnswer}</span>
                  </p>
                  <div className="text-slate-700 pl-4 border-l-2 border-amber-300">
                    <MathRenderer content={q.explanation} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                II
              </span>
              <span>PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {worksheet.part2.length} câu • {worksheet.part2.reduce((s, q) => s + q.points, 0).toFixed(2)} điểm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            Thí sinh trả lời từ câu 1 đến câu {worksheet.part2.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.
            (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ).
          </p>
        </div>

        <div className="space-y-6 pt-2">
          {worksheet.part2.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-800 text-sm whitespace-nowrap">
                    {q.code || `Câu ${idx + 1}`}:
                  </span>
                  <div className="text-sm font-semibold text-slate-900">
                    <MathRenderer content={q.content} />
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded flex-shrink-0">
                  {q.points} đ
                </span>
              </div>

              {/* 4 Statements Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-700 text-xs font-bold border-b border-slate-200">
                      <th className="p-2.5 w-12 text-center">Ý</th>
                      <th className="p-2.5">Mệnh đề / Khẳng định</th>
                      {showSolutions && (
                        <th className="p-2.5 w-24 text-center">Đáp án</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {q.statements.map((stmt) => (
                      <tr key={stmt.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-center font-bold text-indigo-700 align-top">
                          {stmt.id})
                        </td>
                        <td className="p-2.5 text-slate-800 align-top">
                          <MathRenderer content={stmt.content} />
                          {showSolutions && stmt.explanation && (
                            <div className="mt-1 text-xs text-slate-500 italic">
                              <MathRenderer content={`💡 ${stmt.explanation}`} />
                            </div>
                          )}
                        </td>
                        {showSolutions && (
                          <td className="p-2.5 text-center align-top">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                                stmt.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {stmt.isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" /> Sai
                                </>
                              )}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Global Explanation */}
              {showSolutions && q.explanation && (
                <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
                  <span className="font-bold text-amber-900 block mb-0.5">Lời giải tổng quan:</span>
                  <MathRenderer content={q.explanation} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                III
              </span>
              <span>PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {worksheet.part3.length} câu • {worksheet.part3.reduce((s, q) => s + q.points, 0).toFixed(2)} điểm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            Thí sinh trả lời từ câu 1 đến câu {worksheet.part3.length}. Thí sinh tự tính toán và điền đáp số vào ô trống.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {worksheet.part3.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-purple-700 text-sm whitespace-nowrap">
                    {q.code || `Câu ${idx + 1}`}:
                  </span>
                  <div className="text-sm font-medium text-slate-800">
                    <MathRenderer content={q.content} />
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded flex-shrink-0">
                  {q.points} đ
                </span>
              </div>

              {showSolutions && (
                <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đáp số chuẩn:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-indigo-700 font-bold">
                      {q.correctAnswer} {q.unit || ''}
                    </span>
                    {q.acceptableAnswers && q.acceptableAnswers.length > 1 && (
                      <span className="text-slate-500 font-normal">
                        (chấp nhận: {q.acceptableAnswers.join(', ')})
                      </span>
                    )}
                  </div>
                  {q.explanation && (
                    <div className="text-slate-700 pl-4 border-l-2 border-amber-300 mt-1">
                      <MathRenderer content={q.explanation} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PHẦN IV: TỰ LUẬN */}
      {worksheet.part4.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
                  IV
                </span>
                <span>PHẦN IV. BÀI TẬP TỰ LUẬN</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {worksheet.part4.length} bài • {worksheet.part4.reduce((s, q) => s + q.points, 0).toFixed(2)} điểm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 italic">
              Thí sinh trình bày chi tiết lời giải, vẽ hình (nếu có) và lập luận chặt chẽ.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {worksheet.part4.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-rose-700 text-sm whitespace-nowrap">
                      {q.code || `Bài ${idx + 1}`}:
                    </span>
                    <div className="text-sm font-medium text-slate-800">
                      <MathRenderer content={q.content} />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded flex-shrink-0">
                    {q.points} đ
                  </span>
                </div>

                {showSolutions && (
                  <div className="mt-3 p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-4 text-xs">
                    <div>
                      <h5 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                        <span>🎯 Thang điểm chấm chi tiết (Rubric):</span>
                      </h5>
                      <div className="space-y-1.5 pl-2">
                        {q.rubric.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start justify-between gap-4 p-2 bg-white rounded-lg border border-amber-100"
                          >
                            <div className="text-slate-800">
                              <MathRenderer content={step.stepDescription} />
                            </div>
                            <span className="font-bold text-indigo-700 flex-shrink-0">
                              {step.points} đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-bold text-amber-900 mb-1">📝 Lời giải mẫu hoàn chỉnh:</h5>
                      <div className="p-3 bg-white rounded-lg border border-amber-100 text-slate-800 leading-relaxed font-serif text-sm">
                        <MathRenderer content={q.solution} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={onStartPractice}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition text-sm"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Làm bài trực tiếp ngay</span>
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition text-sm shadow-xs"
        >
          <Printer className="w-5 h-5" />
          <span>In phiếu bài tập</span>
        </button>
      </div>
    </div>
  );
};
