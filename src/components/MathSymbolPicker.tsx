import React from 'react';

interface MathSymbolPickerProps {
  onInsert: (snippet: string) => void;
}

const COMMON_SYMBOLS = [
  { label: 'Phân số', snippet: '$\\frac{a}{b}$', preview: 'a/b' },
  { label: 'Căn bậc 2', snippet: '$\\sqrt{x}$', preview: '√x' },
  { label: 'Lũy thừa', snippet: '$x^2$', preview: 'x²' },
  { label: 'Chỉ số dưới', snippet: '$x_1$', preview: 'x₁' },
  { label: 'Nhân', snippet: '$\\cdot$', preview: '·' },
  { label: 'Chia', snippet: '$\\div$', preview: '÷' },
  { label: 'Cộng trừ', snippet: '$\\pm$', preview: '±' },
  { label: 'Bé hơn bằng', snippet: '$\\le$', preview: '≤' },
  { label: 'Lớn hơn bằng', snippet: '$\\ge$', preview: '≥' },
  { label: 'Khác', snippet: '$\\ne$', preview: '≠' },
  { label: 'Xấp xỉ', snippet: '$\\approx$', preview: '≈' },
  { label: 'Độ (°)', snippet: '$^{\\circ}$', preview: '°' },
  { label: 'Số Pi', snippet: '$\\pi$', preview: 'π' },
  { label: 'Tam giác', snippet: '$\\Delta ABC$', preview: 'ΔABC' },
  { label: 'Góc', snippet: '$\\widehat{ABC}$', preview: '∠ABC' },
  { label: 'Vuông góc', snippet: '$\\perp$', preview: '⊥' },
  { label: 'Song song', snippet: '$\\parallel$', preview: '∥' },
  { label: 'Thuộc', snippet: '$\\in$', preview: '∈' },
  { label: 'Không thuộc', snippet: '$\\notin$', preview: '∉' },
  { label: 'Hệ phương trình', snippet: '$$\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}$$', preview: '{ hệ' },
];

export const MathSymbolPicker: React.FC<MathSymbolPickerProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
      <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
        <span>📐 Chèn nhanh:</span>
      </span>
      {COMMON_SYMBOLS.map((item, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onInsert(item.snippet)}
          className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 rounded shadow-xs text-slate-700 transition font-mono"
          title={`Chèn ${item.label} (${item.snippet})`}
        >
          {item.preview}
        </button>
      ))}
    </div>
  );
};
