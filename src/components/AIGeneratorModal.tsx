import React, { useState, useMemo, useEffect } from 'react';
import { generateWorksheetWithAI, MatrixConfig } from '../services/geminiService';
import { Worksheet, GradeLevel } from '../types/worksheet';
import { KNTT_CURRICULUM, LessonItem, ChapterItem, VolumeItem } from '../data/knttCurriculum';
import {
  Sparkles,
  X,
  AlertCircle,
  Search,
  Check,
  RotateCcw,
  ListOrdered,
  Sliders,
  Plus,
  Minus,
  CheckCircle2,
  Settings2,
} from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (worksheet: Worksheet) => void;
  currentGrade: GradeLevel;
}

const MATRIX_PRESETS = [
  {
    name: 'Đề 15 phút (Đánh giá thường xuyên)',
    config: { part1Count: 4, part2Count: 1, part3Count: 2, part4Count: 1 },
    time: 15,
  },
  {
    name: 'Đề 45 phút (Kiểm tra Giữa kỳ)',
    config: { part1Count: 8, part2Count: 2, part3Count: 4, part4Count: 1 },
    time: 45,
  },
  {
    name: 'Đề 60-90 phút (Kiểm tra Học kỳ)',
    config: { part1Count: 12, part2Count: 4, part3Count: 6, part4Count: 2 },
    time: 90,
  },
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
  currentGrade,
}) => {
  const [grade, setGrade] = useState<GradeLevel>(currentGrade);
  const [selectedLessonIds, setSelectedLessonIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Matrix configuration state with local persistence
  const [matrix, setMatrix] = useState<MatrixConfig>(() => {
    const saved = localStorage.getItem('kntt_worksheet_matrix_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.part1Count !== undefined &&
          parsed.part2Count !== undefined &&
          parsed.part3Count !== undefined &&
          parsed.part4Count !== undefined
        ) {
          return {
            part1Count: Math.max(1, Math.min(20, Number(parsed.part1Count))),
            part2Count: Math.max(1, Math.min(10, Number(parsed.part2Count))),
            part3Count: Math.max(1, Math.min(15, Number(parsed.part3Count))),
            part4Count: Math.max(0, Math.min(10, Number(parsed.part4Count))),
          };
        }
      } catch {}
    }
    return {
      part1Count: 4,
      part2Count: 2,
      part3Count: 2,
      part4Count: 1,
    };
  });
  const [isMatrixSaved, setIsMatrixSaved] = useState(false);

  // Sync grade with prop when opened
  useEffect(() => {
    if (isOpen) {
      setGrade(currentGrade);
      setSelectedLessonIds(new Set());
      setTopic('');
      setSearchQuery('');
      setErrorMessage(null);
    }
  }, [isOpen, currentGrade]);

  const volumes: VolumeItem[] = useMemo(() => {
    return KNTT_CURRICULUM[grade] || [];
  }, [grade]);

  // All lessons in current grade
  const allLessons = useMemo(() => {
    const list: { lesson: LessonItem; chapter: ChapterItem; volume: VolumeItem }[] = [];
    volumes.forEach((v) => {
      v.chapters.forEach((c) => {
        c.lessons.forEach((l) => {
          list.push({ lesson: l, chapter: c, volume: v });
        });
      });
    });
    return list;
  }, [volumes]);

  // When grade changes, reset selected lessons
  const handleGradeSelect = (newGrade: GradeLevel) => {
    setGrade(newGrade);
    setSelectedLessonIds(new Set());
    setTopic('');
  };

  // Helper to compile topic string based on selected lessons
  const updateTopicFromSelection = (newSelectedIds: Set<string>) => {
    if (newSelectedIds.size === 0) {
      setTopic('');
      return;
    }

    // Group selected lessons by chapter
    const chapterMap = new Map<string, { chapterName: string; lessons: string[] }>();
    allLessons.forEach(({ lesson, chapter }) => {
      if (newSelectedIds.has(lesson.id)) {
        if (!chapterMap.has(chapter.id)) {
          chapterMap.set(chapter.id, { chapterName: chapter.name, lessons: [] });
        }
        chapterMap.get(chapter.id)!.lessons.push(lesson.name);
      }
    });

    const parts: string[] = [];
    chapterMap.forEach(({ chapterName, lessons }) => {
      const totalLessonsInChapter =
        volumes
          .flatMap((v) => v.chapters)
          .find((c) => c.name === chapterName)?.lessons.length || 0;

      if (lessons.length === totalLessonsInChapter && totalLessonsInChapter > 0) {
        parts.push(chapterName);
      } else {
        parts.push(`${chapterName} (${lessons.join(', ')})`);
      }
    });

    setTopic(parts.join('; '));
  };

  // Toggle single lesson
  const handleToggleLesson = (lessonId: string) => {
    const next = new Set(selectedLessonIds);
    if (next.has(lessonId)) {
      next.delete(lessonId);
    } else {
      next.add(lessonId);
    }
    setSelectedLessonIds(next);
    updateTopicFromSelection(next);
  };

  // Toggle whole chapter
  const handleToggleChapter = (chapter: ChapterItem) => {
    const chapterLessonIds = chapter.lessons.map((l) => l.id);
    const allSelected = chapterLessonIds.every((id) => selectedLessonIds.has(id));

    const next = new Set(selectedLessonIds);
    if (allSelected) {
      chapterLessonIds.forEach((id) => next.delete(id));
    } else {
      chapterLessonIds.forEach((id) => next.add(id));
    }
    setSelectedLessonIds(next);
    updateTopicFromSelection(next);
  };

  // Toggle whole volume
  const handleToggleVolume = (volume: VolumeItem) => {
    const volumeLessonIds = volume.chapters.flatMap((c) => c.lessons.map((l) => l.id));
    const allSelected = volumeLessonIds.every((id) => selectedLessonIds.has(id));

    const next = new Set(selectedLessonIds);
    if (allSelected) {
      volumeLessonIds.forEach((id) => next.delete(id));
    } else {
      volumeLessonIds.forEach((id) => next.add(id));
    }
    setSelectedLessonIds(next);
    updateTopicFromSelection(next);
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedLessonIds(new Set());
    setTopic('');
  };

  // Modify question count in matrix and auto-save
  const handleUpdateMatrix = (key: keyof MatrixConfig, delta: number) => {
    setMatrix((prev) => {
      const limits: Record<keyof MatrixConfig, { min: number; max: number }> = {
        part1Count: { min: 1, max: 20 },
        part2Count: { min: 1, max: 8 },
        part3Count: { min: 1, max: 15 },
        part4Count: { min: 0, max: 10 },
      };
      const current = prev[key];
      const newVal = Math.max(limits[key].min, Math.min(limits[key].max, current + delta));
      const next = { ...prev, [key]: newVal };
      localStorage.setItem('kntt_worksheet_matrix_config', JSON.stringify(next));
      return next;
    });
    setIsMatrixSaved(true);
    setTimeout(() => setIsMatrixSaved(false), 2500);
  };

  const handleApplyPreset = (presetConfig: MatrixConfig) => {
    setMatrix(presetConfig);
    localStorage.setItem('kntt_worksheet_matrix_config', JSON.stringify(presetConfig));
    setIsMatrixSaved(true);
    setTimeout(() => setIsMatrixSaved(false), 2500);
  };

  // Filter lessons based on search query
  const filteredVolumes = useMemo(() => {
    if (!searchQuery.trim()) return volumes;
    const q = searchQuery.toLowerCase().trim();

    return volumes
      .map((volume) => {
        const matchingChapters = volume.chapters
          .map((chapter) => {
            const chapterMatches = chapter.name.toLowerCase().includes(q);
            const matchingLessons = chapter.lessons.filter(
              (l) => l.name.toLowerCase().includes(q) || chapterMatches
            );
            if (chapterMatches || matchingLessons.length > 0) {
              return {
                ...chapter,
                lessons: chapterMatches ? chapter.lessons : matchingLessons,
              };
            }
            return null;
          })
          .filter(Boolean) as ChapterItem[];

        if (matchingChapters.length > 0) {
          return {
            ...volume,
            chapters: matchingChapters,
          };
        }
        return null;
      })
      .filter(Boolean) as VolumeItem[];
  }, [volumes, searchQuery]);

  // Total questions count in matrix
  const totalQuestions =
    matrix.part1Count + matrix.part2Count + matrix.part3Count + matrix.part4Count;

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMessage('Vui lòng chọn bài học trong danh mục KNTT hoặc nhập chủ đề bài học.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await generateWorksheetWithAI(
        grade,
        topic.trim(),
        requirements.trim(),
        matrix
      );
      onGenerated(generated);
      onClose();
    } catch (err: any) {
      console.error('AI generation error:', err);
      setErrorMessage(
        err.message || 'Không thể tạo đề bài tự động bằng AI. Vui lòng kiểm tra lại kết nối.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Trợ Lý AI Soạn Đề Chuẩn 7991</h3>
              <p className="text-xs text-purple-700 font-medium">
                Theo chương trình GDPT 2018 & Bộ sách Kết nối tri thức với cuộc sống (KNTT)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grade selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Chọn khối lớp:</label>
            <div className="grid grid-cols-4 gap-2">
              {([6, 7, 8, 9] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeSelect(g)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    grade === g
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Toán {g} (KNTT)
                </button>
              ))}
            </div>
          </div>

          {/* QUESTION COUNT CONFIGURATION (Chỉnh sửa & Lưu số lượng câu hỏi để tạo đề) */}
          <div className="border border-indigo-200/80 bg-indigo-50/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Sliders className="w-3.5 h-3.5" />
                </span>
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">
                  Cấu hình số lượng câu hỏi tạo đề
                </span>
              </div>

              {isMatrixSaved && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Đã lưu số câu hỏi</span>
                </span>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 self-center mr-1">
                Mẫu đề nhanh:
              </span>
              {MATRIX_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p.config)}
                  className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-100 hover:text-indigo-800 text-slate-700 rounded-lg border border-slate-200 font-medium transition"
                >
                  {p.name.split(' (')[0]} ({p.time}p)
                </button>
              ))}
            </div>

            {/* Matrix Stepper Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {/* Part 1 */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-blue-700 truncate">Phần I: TN Đơn</div>
                <div className="text-[10px] text-slate-400 mb-1.5">4 lựa chọn (0.25đ)</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part1Count', -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Giảm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-black text-slate-900 w-6 text-center">
                    {matrix.part1Count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part1Count', 1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Tăng"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Part 2 */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-emerald-700 truncate">Phần II: Đúng / Sai</div>
                <div className="text-[10px] text-slate-400 mb-1.5">4 ý a,b,c,d (1.0đ)</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part2Count', -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Giảm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-black text-slate-900 w-6 text-center">
                    {matrix.part2Count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part2Count', 1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Tăng"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Part 3 */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-purple-700 truncate">Phần III: TL Ngắn</div>
                <div className="text-[10px] text-slate-400 mb-1.5">Điền đáp số (0.5đ)</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part3Count', -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Giảm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-black text-slate-900 w-6 text-center">
                    {matrix.part3Count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part3Count', 1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Tăng"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Part 4 */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-center shadow-2xs">
                <div className="text-[11px] font-bold text-rose-700 truncate">Phần IV: Tự luận</div>
                <div className="text-[10px] text-slate-400 mb-1.5">Kèm Rubric chấm</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part4Count', -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Giảm"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-black text-slate-900 w-6 text-center">
                    {matrix.part4Count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateMatrix('part4Count', 1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    aria-label="Tăng"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>
                🎯 Tổng số câu trong đề: <strong className="text-slate-900">{totalQuestions} câu</strong>
              </span>
              <span className="text-slate-400 italic">
                (Được lưu tự động để tạo đề thi bất cứ lúc nào)
              </span>
            </div>
          </div>

          {/* KNTT Curriculum Lesson Selector (Matching user's mockup) */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            {/* Header: Nội dung Bài học */}
            <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ListOrdered className="w-4 h-4" />
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  Nội dung Bài học
                </span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Sách KNTT Lớp {grade}
                </span>
              </div>

              {selectedLessonIds.size > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-indigo-700">
                    Đã chọn {selectedLessonIds.size} bài
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-slate-400 hover:text-rose-600 flex items-center gap-0.5 font-medium transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Bỏ chọn</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick search inside curriculum */}
            <div className="p-2.5 bg-white border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm nhanh bài học hoặc tên chương (VD: Hằng đẳng thức, Đơn thức, Thalès...)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Scrollable Curriculum Tree matching User's Mockup */}
            <div className="max-h-56 sm:max-h-64 overflow-y-auto p-3 space-y-3 divide-y divide-slate-100">
              {filteredVolumes.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Không tìm thấy bài học nào phù hợp với từ khóa "{searchQuery}"
                </div>
              ) : (
                filteredVolumes.map((volume) => {
                  const volumeLessonIds = volume.chapters.flatMap((c) =>
                    c.lessons.map((l) => l.id)
                  );
                  const isVolumeAllSelected =
                    volumeLessonIds.length > 0 &&
                    volumeLessonIds.every((id) => selectedLessonIds.has(id));
                  const isVolumePartiallySelected =
                    !isVolumeAllSelected &&
                    volumeLessonIds.some((id) => selectedLessonIds.has(id));

                  return (
                    <div key={volume.id} className="pt-2 first:pt-0 space-y-2">
                      {/* Volume Header with Checkbox */}
                      <div
                        onClick={() => handleToggleVolume(volume)}
                        className="flex items-center gap-2.5 cursor-pointer py-1 select-none group"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition flex-shrink-0 ${
                            isVolumeAllSelected
                              ? 'bg-indigo-600 text-white'
                              : isVolumePartiallySelected
                              ? 'bg-indigo-200 text-indigo-800'
                              : 'border border-slate-400 bg-white group-hover:border-indigo-500'
                          }`}
                        >
                          {(isVolumeAllSelected || isVolumePartiallySelected) && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                          {volume.name}
                        </span>
                      </div>

                      {/* Chapters */}
                      <div className="pl-3 sm:pl-4 space-y-2">
                        {volume.chapters.map((chapter) => {
                          const chapterLessonIds = chapter.lessons.map((l) => l.id);
                          const isChapterAllSelected =
                            chapterLessonIds.length > 0 &&
                            chapterLessonIds.every((id) => selectedLessonIds.has(id));
                          const isChapterPartiallySelected =
                            !isChapterAllSelected &&
                            chapterLessonIds.some((id) => selectedLessonIds.has(id));

                          return (
                            <div key={chapter.id} className="space-y-1.5">
                              {/* Chapter Title with Checkbox */}
                              <div
                                onClick={() => handleToggleChapter(chapter)}
                                className="flex items-start gap-2.5 cursor-pointer py-1 select-none group hover:bg-slate-100/60 rounded-md px-1 transition"
                              >
                                <div
                                  className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center transition flex-shrink-0 ${
                                    isChapterAllSelected
                                      ? 'bg-indigo-600 text-white'
                                      : isChapterPartiallySelected
                                      ? 'bg-indigo-200 text-indigo-800'
                                      : 'border border-slate-400 bg-white group-hover:border-indigo-500'
                                  }`}
                                >
                                  {(isChapterAllSelected || isChapterPartiallySelected) && (
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  )}
                                </div>
                                <span className="font-bold text-slate-800 text-xs leading-snug">
                                  {chapter.name}
                                </span>
                              </div>

                              {/* Lessons list */}
                              <div className="pl-4 sm:pl-6 space-y-1 border-l-2 border-slate-200/80 ml-2">
                                {chapter.lessons.map((lesson) => {
                                  const isSelected = selectedLessonIds.has(lesson.id);

                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => handleToggleLesson(lesson.id)}
                                      className={`flex items-start gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg select-none transition text-xs ${
                                        isSelected
                                          ? 'bg-indigo-50/80 text-indigo-950 font-medium'
                                          : 'hover:bg-slate-100/70 text-slate-700'
                                      }`}
                                    >
                                      <div
                                        className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center transition flex-shrink-0 ${
                                          isSelected
                                            ? 'bg-indigo-600 text-white shadow-2xs'
                                            : 'border border-slate-300 bg-white'
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="w-3 h-3 stroke-[3]" />
                                        )}
                                      </div>
                                      <span className="leading-snug">{lesson.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Topic input (Auto-filled from KNTT curriculum, editable) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Chủ đề / Nội dung bài học tạo đề:
              </label>
              <span className="text-[11px] text-slate-400 italic">
                (Được điền tự động khi tick chọn bài học ở trên)
              </span>
            </div>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Tick chọn các bài học trong danh mục KNTT ở trên hoặc tự nhập chủ đề..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Additional instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Yêu cầu bổ sung của bạn (tùy chọn):
            </label>
            <textarea
              rows={2}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="VD: Chú trọng câu hỏi thực tế, mức độ thông hiểu và vận dụng, có các bước lập luận rõ ràng..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>
              📋 Đề gồm: <strong className="text-purple-700">{totalQuestions} câu</strong> (
              {matrix.part1Count} TN đơn, {matrix.part2Count} Đ/S, {matrix.part3Count} TL ngắn,{' '}
              {matrix.part4Count} Tự luận)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI đang soạn đề ({totalQuestions} câu)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo phiếu ({totalQuestions} câu)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
