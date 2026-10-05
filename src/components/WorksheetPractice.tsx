import React, { useState, useEffect, useRef } from 'react';
import {
  Worksheet,
  StudentAnswers,
  EvaluationResult,
} from '../types/worksheet';
import { MathRenderer } from './MathRenderer';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Send,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface WorksheetPracticeProps {
  worksheet: Worksheet;
  onExit: () => void;
}

export const WorksheetPractice: React.FC<WorksheetPracticeProps> = ({ worksheet, onExit }) => {
  // Answers state
  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    const initP2: Record<string, Record<'a' | 'b' | 'c' | 'd', boolean | null>> = {};
    worksheet.part2.forEach((q) => {
      initP2[q.id] = { a: null, b: null, c: null, d: null };
    });

    return {
      part1: {},
      part2: initP2,
      part3: {},
      part4Notes: {},
      part4SelfScores: {},
    };
  });

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(
    worksheet.metadata.durationMinutes * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && !isSubmitted && secondsRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && !isSubmitted) {
      // Auto-submit on time expiry
      handleSubmit();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [secondsRemaining, isTimerRunning, isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Part 1 selection
  const handleSelectP1 = (qId: string, opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      part1: { ...prev.part1, [qId]: opt },
    }));
  };

  // Handle Part 2 True/False selection
  const handleSelectP2 = (qId: string, stmtId: 'a' | 'b' | 'c' | 'd', val: boolean) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      part2: {
        ...prev.part2,
        [qId]: {
          ...(prev.part2[qId] || { a: null, b: null, c: null, d: null }),
          [stmtId]: val,
        },
      },
    }));
  };

  // Handle Part 3 text input
  const handleInputP3 = (qId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      part3: { ...prev.part3, [qId]: val },
    }));
  };

  // Handle Part 4 notes
  const handleInputP4Note = (qId: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      part4Notes: { ...prev.part4Notes, [qId]: val },
    }));
  };

  // Clean and normalize answers for comparison
  const normalizeAnswer = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/độ|°/g, '');
  };

  // Grade test according to Công văn 7991 rules
  const handleSubmit = () => {
    // 1. Part 1 Scoring
    let p1Earned = 0;
    let p1Max = 0;
    const p1Details: Record<string, { isCorrect: boolean; pointsEarned: number }> = {};

    worksheet.part1.forEach((q) => {
      p1Max += q.points;
      const studentChoice = answers.part1[q.id];
      const isCorrect = studentChoice === q.correctAnswer;
      const pts = isCorrect ? q.points : 0;
      p1Earned += pts;
      p1Details[q.id] = { isCorrect, pointsEarned: pts };
    });

    // 2. Part 2 Scoring (CV 7991 Formula: 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ)
    let p2Earned = 0;
    let p2Max = 0;
    const p2Details: Record<string, { correctCount: number; pointsEarned: number }> = {};

    worksheet.part2.forEach((q) => {
      p2Max += q.points;
      const qAns = answers.part2[q.id] || { a: null, b: null, c: null, d: null };
      let correctCount = 0;

      q.statements.forEach((stmt) => {
        if (qAns[stmt.id] === stmt.isCorrect) {
          correctCount++;
        }
      });

      let pts = 0;
      if (correctCount === 1) pts = 0.1;
      else if (correctCount === 2) pts = 0.25;
      else if (correctCount === 3) pts = 0.5;
      else if (correctCount === 4) pts = 1.0;

      p2Earned += pts;
      p2Details[q.id] = { correctCount, pointsEarned: pts };
    });

    // 3. Part 3 Scoring (Short answers)
    let p3Earned = 0;
    let p3Max = 0;
    const p3Details: Record<string, { isCorrect: boolean; pointsEarned: number }> = {};

    worksheet.part3.forEach((q) => {
      p3Max += q.points;
      const studentInput = normalizeAnswer(answers.part3[q.id] || '');
      const validAnswers = [q.correctAnswer, ...(q.acceptableAnswers || [])].map(normalizeAnswer);

      const isCorrect = studentInput.length > 0 && validAnswers.includes(studentInput);
      const pts = isCorrect ? q.points : 0;
      p3Earned += pts;
      p3Details[q.id] = { isCorrect, pointsEarned: pts };
    });

    // 4. Part 4 Scoring (Self-evaluation or teacher rubric)
    let p4Earned = 0;
    let p4Max = 0;
    worksheet.part4.forEach((q) => {
      p4Max += q.points;
      const selfPts = answers.part4SelfScores[q.id] ?? 0;
      p4Earned += selfPts;
    });

    const totalEarned = p1Earned + p2Earned + p3Earned + p4Earned;
    const totalMax = p1Max + p2Max + p3Max + p4Max;
    const timeSpent = worksheet.metadata.durationMinutes * 60 - secondsRemaining;

    setEvaluation({
      part1Score: p1Earned,
      part1MaxScore: p1Max,
      part1Details: p1Details,
      part2Score: p2Earned,
      part2MaxScore: p2Max,
      part2Details: p2Details,
      part3Score: p3Earned,
      part3MaxScore: p3Max,
      part3Details: p3Details,
      part4Score: p4Earned,
      part4MaxScore: p4Max,
      totalScore: totalEarned,
      maxScore: totalMax,
      timeSpentSeconds: timeSpent,
    });

    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  const handleRetest = () => {
    const initP2: Record<string, Record<'a' | 'b' | 'c' | 'd', boolean | null>> = {};
    worksheet.part2.forEach((q) => {
      initP2[q.id] = { a: null, b: null, c: null, d: null };
    });

    setAnswers({
      part1: {},
      part2: initP2,
      part3: {},
      part4Notes: {},
      part4SelfScores: {},
    });
    setSecondsRemaining(worksheet.metadata.durationMinutes * 60);
    setIsTimerRunning(true);
    setIsSubmitted(false);
    setEvaluation(null);
  };

  // Count answered questions
  const answeredP1Count = Object.keys(answers.part1).length;
  const answeredP2Count = Object.values(answers.part2).filter((q) =>
    ['a', 'b', 'c', 'd'].every((k) => q[k as 'a' | 'b' | 'c' | 'd'] !== null)
  ).length;
  const answeredP3Count = Object.values(answers.part3).filter((v) => v.trim() !== '').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Sticky Practice Header Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
              {worksheet.metadata.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Lớp {worksheet.metadata.grade}</span>
              <span>•</span>
              <span>
                Đã trả lời:{' '}
                <strong className="text-indigo-600">
                  {answeredP1Count + answeredP2Count + answeredP3Count}
                </strong>
                /{worksheet.part1.length + worksheet.part2.length + worksheet.part3.length} câu TN
              </span>
            </div>
          </div>
        </div>

        {/* Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition ${
              secondsRemaining < 300
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài chấm điểm</span>
            </button>
          ) : (
            <button
              onClick={handleRetest}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Evaluation Results Banner (when submitted) */}
      {isSubmitted && evaluation && (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center p-2">
                <span className="text-3xl font-black text-amber-400">
                  {evaluation.totalScore.toFixed(2)}
                </span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase">
                  / {evaluation.maxScore.toFixed(2)} đ
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold flex items-center justify-center sm:justify-start gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>Kết Quả Bài Kiểm Tra</span>
                </h3>
                <p className="text-blue-200 text-xs sm:text-sm mt-1">
                  Thời gian làm bài: {Math.floor(evaluation.timeSpentSeconds / 60)} phút{' '}
                  {evaluation.timeSpentSeconds % 60} giây
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-blue-100">
                  {evaluation.totalScore >= 8.0
                    ? '🌟 Xuất sắc / Giỏi'
                    : evaluation.totalScore >= 6.5
                    ? '👍 Khá'
                    : evaluation.totalScore >= 5.0
                    ? '📚 Trung bình'
                    : '⚡ Cần cố gắng thêm'}
                </div>
              </div>
            </div>

            {/* Score Breakdown pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto">
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                <p className="text-[11px] text-blue-200">Phần I (Nhiều LC)</p>
                <p className="text-base font-bold text-white mt-0.5">
                  {evaluation.part1Score.toFixed(2)} / {evaluation.part1MaxScore.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                <p className="text-[11px] text-blue-200">Phần II (Đúng/Sai)</p>
                <p className="text-base font-bold text-white mt-0.5">
                  {evaluation.part2Score.toFixed(2)} / {evaluation.part2MaxScore.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                <p className="text-[11px] text-blue-200">Phần III (Trả lời ngắn)</p>
                <p className="text-base font-bold text-white mt-0.5">
                  {evaluation.part3Score.toFixed(2)} / {evaluation.part3MaxScore.toFixed(2)}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                <p className="text-[11px] text-blue-200">Phần IV (Tự luận)</p>
                <p className="text-base font-bold text-white mt-0.5">
                  {evaluation.part4Score.toFixed(2)} / {evaluation.part4MaxScore.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              I
            </span>
            <span>PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN</span>
          </h3>
          <span className="text-xs text-slate-500">Mỗi câu 0.25 điểm</span>
        </div>

        <div className="space-y-6">
          {worksheet.part1.map((q, idx) => {
            const studentChoice = answers.part1[q.id];
            const isEvaluated = isSubmitted && evaluation;
            const qResult = isEvaluated ? evaluation.part1Details[q.id] : null;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition ${
                  isEvaluated
                    ? qResult?.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700 text-sm whitespace-nowrap">
                      {q.code || `Câu ${idx + 1}`}:
                    </span>
                    <div className="text-sm font-medium text-slate-900">
                      <MathRenderer content={q.content} />
                    </div>
                  </div>
                  {isEvaluated && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        qResult?.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {qResult?.isCorrect ? (
                        <>
                          <Check className="w-3 h-3" /> +{q.points}đ
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> 0đ
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* 4 Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-4 sm:pl-6">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const isSelected = studentChoice === optKey;
                    const isCorrectAnswer = q.correctAnswer === optKey;

                    let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';
                    if (!isSubmitted) {
                      if (isSelected) {
                        btnClass =
                          'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-2 ring-indigo-500/20';
                      }
                    } else {
                      if (isCorrectAnswer) {
                        btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnClass = 'bg-rose-100 border-rose-500 text-rose-950 line-through';
                      }
                    }

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectP1(q.id, optKey)}
                        disabled={isSubmitted}
                        className={`text-left p-3 rounded-xl border flex items-start gap-3 transition ${btnClass}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {optKey}
                        </span>
                        <div className="flex-1 text-sm">
                          <MathRenderer content={q.options[optKey]} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isSubmitted && (
                  <div className="mt-3 p-3 bg-white/90 border border-slate-200 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Đáp án đúng: </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {q.correctAnswer}
                      </span>
                    </p>
                    <div className="text-slate-600 pl-3 border-l-2 border-indigo-400 mt-1">
                      <MathRenderer content={q.explanation} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              II
            </span>
            <span>PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI</span>
          </h3>
          <span className="text-xs text-slate-500">Mỗi câu tối đa 1.0 điểm</span>
        </div>

        <div className="space-y-6">
          {worksheet.part2.map((q, idx) => {
            const qAns = answers.part2[q.id] || { a: null, b: null, c: null, d: null };
            const qResult = isSubmitted && evaluation ? evaluation.part2Details[q.id] : null;

            return (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800 text-sm whitespace-nowrap">
                      {q.code || `Câu ${idx + 1}`}:
                    </span>
                    <div className="text-sm font-semibold text-slate-900">
                      <MathRenderer content={q.content} />
                    </div>
                  </div>
                  {isSubmitted && qResult && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">
                      Đúng {qResult.correctCount}/4 ý (+{qResult.pointsEarned.toFixed(2)}đ)
                    </span>
                  )}
                </div>

                {/* Table of 4 Statements with Interactive Radio Buttons */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-xs font-bold border-b border-slate-200">
                        <th className="p-3 w-12 text-center">Ý</th>
                        <th className="p-3">Khẳng định / Mệnh đề</th>
                        <th className="p-3 w-40 text-center">Lựa chọn của bạn</th>
                        {isSubmitted && <th className="p-3 w-28 text-center">Đáp án</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {q.statements.map((stmt) => {
                        const studentVal = qAns[stmt.id];
                        const isCorrectStmt = studentVal === stmt.isCorrect;

                        return (
                          <tr
                            key={stmt.id}
                            className={`hover:bg-slate-50/50 ${
                              isSubmitted
                                ? isCorrectStmt
                                  ? 'bg-emerald-50/20'
                                  : 'bg-rose-50/20'
                                : ''
                            }`}
                          >
                            <td className="p-3 text-center font-bold text-indigo-700 align-top">
                              {stmt.id})
                            </td>
                            <td className="p-3 text-slate-800 align-top">
                              <MathRenderer content={stmt.content} />
                              {isSubmitted && stmt.explanation && (
                                <div className="mt-1 text-xs text-slate-500 italic">
                                  <MathRenderer content={`💡 ${stmt.explanation}`} />
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-center align-top">
                              <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                                <button
                                  type="button"
                                  disabled={isSubmitted}
                                  onClick={() => handleSelectP2(q.id, stmt.id, true)}
                                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                                    studentVal === true
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  Đúng
                                </button>
                                <button
                                  type="button"
                                  disabled={isSubmitted}
                                  onClick={() => handleSelectP2(q.id, stmt.id, false)}
                                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                                    studentVal === false
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  Sai
                                </button>
                              </div>
                            </td>
                            {isSubmitted && (
                              <td className="p-3 text-center align-top">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                                    stmt.isCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {stmt.isCorrect ? 'Đúng' : 'Sai'}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
              III
            </span>
            <span>PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN</span>
          </h3>
          <span className="text-xs text-slate-500">Mỗi câu 0.5 điểm</span>
        </div>

        <div className="space-y-6">
          {worksheet.part3.map((q, idx) => {
            const studentInput = answers.part3[q.id] || '';
            const qResult = isSubmitted && evaluation ? evaluation.part3Details[q.id] : null;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition ${
                  isSubmitted
                    ? qResult?.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-700 text-sm whitespace-nowrap">
                      {q.code || `Câu ${idx + 1}`}:
                    </span>
                    <div className="text-sm font-medium text-slate-900">
                      <MathRenderer content={q.content} />
                    </div>
                  </div>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        qResult?.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {qResult?.isCorrect ? `+${q.points}đ` : '0đ'}
                    </span>
                  )}
                </div>

                {/* Input area */}
                <div className="flex flex-wrap items-center gap-3 pl-4 sm:pl-6">
                  <label className="text-xs font-bold text-slate-600">Đáp số của bạn:</label>
                  <input
                    type="text"
                    value={studentInput}
                    onChange={(e) => handleInputP3(q.id, e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Nhập số hoặc phân số..."
                    className="w-48 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden disabled:bg-slate-100"
                  />
                  {q.unit && (
                    <span className="text-xs font-semibold text-slate-500">({q.unit})</span>
                  )}
                </div>

                {/* Explanation when submitted */}
                {isSubmitted && (
                  <div className="mt-3 p-3 bg-white/90 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>Đáp số chuẩn:</span>
                      <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {q.correctAnswer} {q.unit || ''}
                      </span>
                      {q.acceptableAnswers && (
                        <span className="text-slate-500 font-normal">
                          (chấp nhận: {q.acceptableAnswers.join(', ')})
                        </span>
                      )}
                    </div>
                    {q.explanation && (
                      <div className="text-slate-600 pl-3 border-l-2 border-purple-300 mt-1">
                        <MathRenderer content={q.explanation} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PHẦN IV: TỰ LUẬN (Với Rubric tự chấm điểm) */}
      {worksheet.part4.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              IV
            </span>
            <span>PHẦN IV. TỰ LUẬN & ĐỐI CHIẾU LỜI GIẢI</span>
          </h3>
          <span className="text-xs text-slate-500">Trình bày bài giải</span>
        </div>

        <div className="space-y-6">
          {worksheet.part4.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-rose-700 text-sm whitespace-nowrap">
                    {q.code || `Bài ${idx + 1}`}:
                  </span>
                  <div className="text-sm font-medium text-slate-900">
                    <MathRenderer content={q.content} />
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {q.points} điểm
                </span>
              </div>

              {/* Student solution textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">
                  Nháp bài giải / Ghi chú của học sinh:
                </label>
                <textarea
                  rows={4}
                  value={answers.part4Notes[q.id] || ''}
                  onChange={(e) => handleInputP4Note(q.id, e.target.value)}
                  placeholder="Ghi các bước giải chính, kết quả từng ý..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              {/* Solution & Rubric when submitted */}
              {isSubmitted && (
                <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-4 text-xs">
                  <div>
                    <h5 className="font-bold text-amber-950 mb-2 flex items-center gap-1.5">
                      <span>🎯 Đối chiếu thang điểm (Rubric):</span>
                    </h5>
                    <div className="space-y-1.5 pl-2">
                      {q.rubric.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start justify-between gap-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200"
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
                    <h5 className="font-bold text-amber-950 mb-1">📝 Lời giải mẫu chi tiết:</h5>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-serif text-sm">
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

      {/* Bottom Submit Action */}
      {!isSubmitted && (
        <div className="flex items-center justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200 transition text-base"
          >
            <Send className="w-5 h-5" />
            <span>Nộp bài & Chấm điểm theo chuẩn CV 7991</span>
          </button>
        </div>
      )}
    </div>
  );
};
