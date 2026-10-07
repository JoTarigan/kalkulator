import React from 'react';
import type { AngleMode } from '../utils/calculator';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isScientific: boolean;
  onToggleScientific: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  isScientific,
  onToggleScientific,
  onOpenHistory,
  historyCount,
  angleMode,
  onToggleAngleMode,
}) => {
  return (
    <header className="calc-header">
      <div className="calc-brand">
        <div className="calc-logo-icon" aria-hidden="true">
          ±
        </div>
        <div>
          <h1 className="calc-title-text">Kalkulator</h1>
        </div>
      </div>

      <div className="calc-header-actions">
        {isScientific && (
          <button
            type="button"
            id="btn-angle-mode"
            className="icon-button active"
            onClick={onToggleAngleMode}
            title={`Mode Sudut: ${angleMode} (Klik untuk ganti)`}
            aria-label={`Ganti mode sudut, saat ini ${angleMode}`}
            style={{ fontSize: '0.75rem', fontWeight: 700, width: '42px' }}
          >
            {angleMode}
          </button>
        )}

        <button
          type="button"
          id="btn-toggle-scientific"
          className={`icon-button ${isScientific ? 'active' : ''}`}
          onClick={onToggleScientific}
          title={isScientific ? 'Beralih ke Mode Standar' : 'Beralih ke Mode Saintifik'}
          aria-label="Alihkan mode saintifik"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
        </button>

        <button
          type="button"
          id="btn-toggle-sound"
          className={`icon-button ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Matikan Suara Klik' : 'Aktifkan Suara Klik'}
          aria-label={soundEnabled ? 'Matikan efek suara' : 'Aktifkan efek suara'}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        <button
          type="button"
          id="btn-open-history"
          className="icon-button"
          onClick={onOpenHistory}
          title="Riwayat Perhitungan"
          aria-label="Buka riwayat perhitungan"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {historyCount > 0 && <span className="badge-count">{historyCount}</span>}
        </button>

        <button
          type="button"
          id="btn-toggle-theme"
          className="icon-button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
          aria-label="Ganti tema warna"
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
