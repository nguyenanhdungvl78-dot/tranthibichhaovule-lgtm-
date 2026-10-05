import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Server-side endpoint to generate math worksheets according to Công văn 7991
app.post('/api/generate-worksheet', async (req, res) => {
  try {
    const { grade, topic, requirements, matrix } = req.body;

    if (!topic || !grade) {
      return res.status(400).json({ error: 'Thiếu thông tin khối lớp hoặc chủ đề bài học.' });
    }

    const p1Count = Math.max(1, Math.min(20, Number(matrix?.part1Count) || 4));
    const p2Count = Math.max(1, Math.min(10, Number(matrix?.part2Count) || 2));
    const p3Count = Math.max(1, Math.min(15, Number(matrix?.part3Count) || 2));
    const p4Count = Math.max(0, Math.min(10, matrix?.part4Count !== undefined ? Number(matrix.part4Count) : 1));

    const prompt = `Bạn là chuyên gia thẩm định và ra đề thi môn Toán THCS Việt Nam theo Chương trình GDPT 2018, bám sát bộ sách giáo khoa "Kết nối tri thức với cuộc sống" (KNTT) và chuẩn cấu trúc Công văn 7991/BGDĐT.
Hãy biên soạn 1 phiếu bài tập/đề kiểm tra Toán lớp ${grade} (sách Kết nối tri thức) với nội dung bài học: "${topic}".
Yêu cầu bổ sung của giáo viên: ${requirements || 'Bám sát nội dung bài học bộ sách KNTT, ma trận và chuẩn kiến thức kỹ năng GDPT 2018'}.

QUY ĐỊNH BẮT BUỘC VỀ SỐ LƯỢNG CÂU HỎI THEO MA TRẬN YÊU CẦU:
1. PHẦN I (Trắc nghiệm nhiều lựa chọn: 4 phương án A, B, C, D - chọn 1 đáp án đúng): Tạo ĐÚNG CHÍNH XÁC ${p1Count} câu (từ Câu 1 đến Câu ${p1Count}; điểm mỗi câu 0.25đ).
2. PHẦN II (Trắc nghiệm Đúng / Sai): Tạo ĐÚNG CHÍNH XÁC ${p2Count} câu (từ Câu 1 đến Câu ${p2Count}; mỗi câu có 4 ý a, b, c, d với điểm tối đa 1.0đ/câu; nêu rõ Đúng/Sai cho từng ý và lời giải).
3. PHẦN III (Trắc nghiệm trả lời ngắn): Tạo ĐÚNG CHÍNH XÁC ${p3Count} câu (từ Câu 1 đến Câu ${p3Count}; học sinh tự điền đáp số ngắn dạng số hoặc phân số rút gọn; điểm mỗi câu 0.5đ).
${
  p4Count === 0
    ? '4. PHẦN IV (Tự luận): Đề thi KHÔNG CÓ phần tự luận (0 câu), trường "part4" BẮT BUỘC trả về mảng rỗng [].'
    : `4. PHẦN IV (Tự luận): Tạo ĐÚNG CHÍNH XÁC ${p4Count} bài tự luận (từ Bài 1 đến Bài ${p4Count}; mỗi bài có ma trận thang điểm Rubric rõ ràng và lời giải chi tiết).`
}

LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG TOÁN HỌC & JSON:
- Dùng ký hiệu LaTeX kẹp giữa $...$ cho công thức toán trong dòng, ví dụ: $x^2 - 4x + 3 = 0$, $\\sqrt{x}$, $\\frac{a}{b}$, $\\Delta ABC$.
- Trong chuỗi JSON, tất cả dấu gạch chéo ngược LaTeX phải được escape bằng hai dấu gạch chéo ngược (ví dụ \\\\frac{a}{b}, \\\\sqrt{x}, \\\\le, \\\\ne).
- Trả về DUY NHẤT một chuỗi JSON hợp lệ, KHÔNG bao quanh bởi markdown (\`\`\`json ... \`\`\`), với cấu trúc sau:

{
  "metadata": {
    "id": "ws-ai-${Date.now()}",
    "title": "Phiếu Bài Tập Toán ${grade} - ${topic}",
    "grade": ${grade},
    "topic": "${topic}",
    "schoolName": "Trường THCS Chuẩn",
    "durationMinutes": 45,
    "academicYear": "2025 - 2026",
    "author": "Trợ lý Giáo viên AI",
    "createdAt": "${new Date().toISOString()}",
    "updatedAt": "${new Date().toISOString()}",
    "description": "Phiếu bài tập chuẩn định dạng Công văn 7991/BGDĐT"
  },
  "part1": [
    {
      "id": "p1_q1",
      "code": "Câu 1",
      "content": "...",
      "level": "nhan_biet",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "points": 0.25,
      "explanation": "..."
    }
  ],
  "part2": [
    {
      "id": "p2_q1",
      "code": "Câu 1",
      "content": "...",
      "level": "thong_hieu",
      "points": 1.0,
      "explanation": "...",
      "statements": [
        { "id": "a", "content": "...", "isCorrect": true, "explanation": "..." },
        { "id": "b", "content": "...", "isCorrect": false, "explanation": "..." },
        { "id": "c", "content": "...", "isCorrect": true, "explanation": "..." },
        { "id": "d", "content": "...", "isCorrect": false, "explanation": "..." }
      ]
    }
  ],
  "part3": [
    {
      "id": "p3_q1",
      "code": "Câu 1",
      "content": "...",
      "level": "van_dung",
      "correctAnswer": "...",
      "acceptableAnswers": ["..."],
      "unit": "...",
      "points": 0.5,
      "explanation": "..."
    }
  ],
  "part4": [
    {
      "id": "p4_q1",
      "code": "Bài 1",
      "content": "...",
      "level": "van_dung",
      "points": 2.0,
      "rubric": [
        { "stepDescription": "...", "points": 1.0 },
        { "stepDescription": "...", "points": 1.0 }
      ],
      "solution": "..."
    }
  ]
}`;

    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];
    let lastError: any = null;
    let text = '';

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          text = response.text || '';
          if (text) break;
        } catch (err: any) {
          lastError = err;
          // If high demand 503 or 429, wait a bit before retrying
          await new Promise((r) => setTimeout(r, 1200 * attempt));
        }
      }
      if (text) break;
    }

    if (!text) {
      throw lastError || new Error('Không nhận được nội dung phản hồi từ AI.');
    }

    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    // Parse JSON with tolerance for LaTeX backslashes
    const parsed = parseJsonWithLatex(cleaned);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini generate worksheet error:', error);
    res.status(500).json({
      error: error.message || 'Lỗi khi gọi mô hình Gemini để tạo phiếu bài tập.',
    });
  }
});

/**
 * Parses JSON that may contain raw LaTeX backslashes (e.g. \frac, \sqrt, \ne, \le, \right)
 * and trims any extraneous text before { or after balanced }
 */
function parseJsonWithLatex(raw: string): any {
  // First, extract balanced JSON object starting from first '{'
  const startIdx = raw.indexOf('{');
  if (startIdx === -1) {
    throw new Error('Dữ liệu trả về từ AI không chứa khối JSON hợp lệ.');
  }

  let depth = 0;
  let inString = false;
  let extracted = raw.slice(startIdx);

  for (let i = startIdx; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"') {
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && raw[j] === '\\') {
        backslashes++;
        j--;
      }
      if (backslashes % 2 === 0) {
        inString = !inString;
      }
    } else if (!inString) {
      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          extracted = raw.slice(startIdx, i + 1);
          break;
        }
      }
    }
  }

  // Try parsing extracted string directly
  try {
    return JSON.parse(extracted);
  } catch {
    // Sanitize unescaped LaTeX backslashes and control characters inside JSON strings
    let sanitized = sanitizeLatexInJson(extracted);
    // Remove accidental trailing commas before } or ]
    sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');

    try {
      return JSON.parse(sanitized);
    } catch (err: any) {
      console.error('Failed to parse sanitized JSON:', err.message, '\nSnippet:', sanitized.slice(0, 300));
      throw new Error('Không thể phân tích dữ liệu đề thi trả về từ AI. Vui lòng thử lại.');
    }
  }
}

function sanitizeLatexInJson(jsonStr: string): string {
  let res = '';
  let inStr = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];

    if (c === '"') {
      // Count preceding backslashes to determine if quote is escaped
      let backslashes = 0;
      let j = i - 1;
      while (j >= 0 && jsonStr[j] === '\\') {
        backslashes++;
        j--;
      }
      if (backslashes % 2 === 0) {
        inStr = !inStr;
      }
      res += c;
    } else if (inStr && c === '\\') {
      const next = jsonStr[i + 1];

      // If followed by quote or another backslash
      if (next === '"' || next === '\\') {
        res += c + next;
        i++;
      } else if (next === 'u' && /^[0-9a-fA-F]{4}$/.test(jsonStr.slice(i + 2, i + 6))) {
        // Valid unicode escape \uXXXX
        res += c + next + jsonStr.slice(i + 2, i + 6);
        i += 5;
      } else if ((next === 'n' || next === 'r' || next === 't') && !/^[a-zA-Z]/.test(jsonStr[i + 2] || '')) {
        // True newline \n, return \r, tab \t (not followed by letters like \neq, \times, \theta, \right)
        res += c + next;
        i++;
      } else {
        // Any LaTeX command or backslash: \frac, \sqrt, \ne, \le, \right, \left, \Delta, \cdot, \unit, etc.
        // In JSON strings, this MUST be written as \\
        res += '\\\\';
      }
    } else if (inStr && (c === '\n' || c === '\r')) {
      // Unescaped literal newline inside string
      res += '\\n';
    } else {
      res += c;
    }
  }

  return res;
}

async function startServer() {
  if (!isProduction) {
    // Vite middleware for development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
