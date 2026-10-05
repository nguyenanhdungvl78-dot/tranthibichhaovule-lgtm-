export type GradeLevel = 6 | 7 | 8 | 9;

export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export const COGNITIVE_LEVEL_LABELS: Record<CognitiveLevel, string> = {
  nhan_biet: 'Nhận biết',
  thong_hieu: 'Thông hiểu',
  van_dung: 'Vận dụng',
  van_dung_cao: 'Vận dụng cao',
};

// Dạng 1: Trắc nghiệm 4 lựa chọn (A, B, C, D) - Chọn 1 đáp án đúng
export interface Part1Question {
  id: string;
  code: string; // Ví dụ: C1, C2...
  content: string; // Nội dung câu hỏi (hỗ trợ LaTeX $...$)
  level: CognitiveLevel;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  points: number; // Mặc định 0.25 điểm
  explanation: string; // Lời giải chi tiết
}

// Dạng 2: Trắc nghiệm Đúng / Sai theo Công văn 7991 (gồm 4 ý a, b, c, d)
export interface TrueFalseStatement {
  id: 'a' | 'b' | 'c' | 'd';
  content: string;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation: string; // Giải thích ngắn cho ý này
}

export interface Part2Question {
  id: string;
  code: string; // Ví dụ: C1, C2...
  content: string; // Đoạn ngữ cảnh / đề bài chung
  level: CognitiveLevel;
  statements: [TrueFalseStatement, TrueFalseStatement, TrueFalseStatement, TrueFalseStatement];
  points: number; // Mặc định 1.0 điểm cho cả câu
  explanation: string; // Lời giải tổng quan
}

// Dạng 3: Trắc nghiệm trả lời ngắn (học sinh tự điền số/kết quả)
export interface Part3Question {
  id: string;
  code: string;
  content: string;
  level: CognitiveLevel;
  correctAnswer: string; // Đáp số chuẩn (ví dụ "12", "-3.5", "1/2", "45")
  acceptableAnswers?: string[]; // Các dạng tương đương (ví dụ ["0.5", "1/2"])
  unit?: string; // Đơn vị nếu có (cm, cm², độ...)
  points: number; // Mặc định 0.5 điểm
  explanation: string;
}

// Phần Tự Luận: Trình bày bài giải hoàn chỉnh theo bước & thang điểm
export interface EssayStep {
  stepDescription: string;
  points: number;
}

export interface Part4Question {
  id: string;
  code: string;
  content: string;
  level: CognitiveLevel;
  points: number; // Điểm bài tự luận (ví dụ 1.0, 1.5, 2.0...)
  rubric: EssayStep[]; // Thang điểm chi tiết từng bước
  solution: string; // Lời giải mẫu chi tiết
}

export interface WorksheetMetadata {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string; // Ví dụ: "Chương I: Số tự nhiên", "Hệ thức lượng trong tam giác vuông"
  schoolName: string;
  durationMinutes: number; // Thời gian làm bài (ví dụ 45, 60, 90 phút)
  academicYear: string; // 2025-2026
  author: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface Worksheet {
  metadata: WorksheetMetadata;
  part1: Part1Question[]; // Dạng 1: Nhiều lựa chọn
  part2: Part2Question[]; // Dạng 2: Đúng / Sai (mỗi câu 4 ý)
  part3: Part3Question[]; // Dạng 3: Trả lời ngắn
  part4: Part4Question[]; // Phần Tự luận
}

// Kết quả làm bài của học sinh
export interface StudentAnswers {
  part1: Record<string, 'A' | 'B' | 'C' | 'D'>;
  part2: Record<string, Record<'a' | 'b' | 'c' | 'd', boolean | null>>;
  part3: Record<string, string>;
  part4Notes: Record<string, string>;
  part4SelfScores: Record<string, number>;
}

export interface EvaluationResult {
  part1Score: number;
  part1MaxScore: number;
  part1Details: Record<string, { isCorrect: boolean; pointsEarned: number }>;

  part2Score: number;
  part2MaxScore: number;
  part2Details: Record<string, { correctCount: number; pointsEarned: number }>;

  part3Score: number;
  part3MaxScore: number;
  part3Details: Record<string, { isCorrect: boolean; pointsEarned: number }>;

  part4Score: number;
  part4MaxScore: number;

  totalScore: number;
  maxScore: number;
  timeSpentSeconds: number;
}
