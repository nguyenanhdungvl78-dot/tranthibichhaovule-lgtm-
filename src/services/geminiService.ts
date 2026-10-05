import { Worksheet, GradeLevel } from '../types/worksheet';

export interface MatrixConfig {
  part1Count: number;
  part2Count: number;
  part3Count: number;
  part4Count: number;
}

/**
 * Service to generate Math questions or full worksheets complying with Công văn 7991
 * Calls the secure backend server endpoint which uses Gemini 3.8 Flash
 */
export async function generateWorksheetWithAI(
  grade: GradeLevel,
  topic: string,
  requirements?: string,
  matrix?: MatrixConfig
): Promise<Worksheet> {
  const response = await fetch('/api/generate-worksheet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grade,
      topic,
      requirements,
      matrix: matrix || {
        part1Count: 4,
        part2Count: 2,
        part3Count: 2,
        part4Count: 1,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Lỗi từ hệ thống AI Gemini (${response.status})`
    );
  }

  const data = await response.json();
  if (!data.metadata || !data.part1 || !data.part2 || !data.part3 || !data.part4) {
    throw new Error('Dữ liệu phiếu bài tập trả về không đầy đủ cấu trúc 4 phần chuẩn CV 7991.');
  }

  return data as Worksheet;
}
