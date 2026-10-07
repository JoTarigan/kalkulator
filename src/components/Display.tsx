import React from 'react';
import type { AngleMode } from '../utils/calculator';

interface DisplayProps {
  expression: string;
  currentInput: string;
  isScientific: boolean;
  angleMode: AngleMode;
  onCopy: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentInput,
  isScientific,
  angleMode,
  onCopy,
}) => {
  // Dynamically calculate font-size so long numbers don't wrap awkwardly
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len <= 9) return '2.6rem';
    if (len <= 13) return '2.1rem';
    if (len <= 17) return '1.7rem';
    return '1.35rem';
  };

  return (
    <div
      className="calc-display"
      onClick={onCopy}
      title="Klik untuk menyalin angka"
      role="region"
      aria-label="Layar kalkulator"
      id="calculator-display"
    >
      <div className="display-copy-hint">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        Salin
      </div>

      <div className="display-expression" id="display-expression-text" aria-live="polite">
        {expression || '\u00A0'}
      </div>

      <div className="display-main-row">
        {isScientific && (
          <span className="display-mode-badge" id="display-mode-indicator">
            {angleMode}
          </span>
        )}
        <div
          className="display-value"
          id="display-value-text"
          style={{ fontSize: getFontSize(currentInput) }}
          aria-live="polite"
        >
          {currentInput}
        </div>
      </div>
    </div>
  );
};
