import React from 'react';
import type { HistoryItem } from '../utils/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="history-drawer" role="dialog" aria-modal="true" aria-label="Riwayat Perhitungan">
      <div className="history-header">
        <h2 className="history-title">Riwayat Perhitungan</h2>
        <div className="history-actions">
          {history.length > 0 && (
            <button
              type="button"
              id="btn-clear-history"
              className="icon-button"
              onClick={onClearHistory}
              title="Hapus Semua Riwayat"
              aria-label="Hapus semua riwayat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}
          <button
            type="button"
            id="btn-close-history"
            className="icon-button"
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup riwayat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="history-list" id="history-items-container">
        {history.length === 0 ? (
          <div className="history-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p>Belum ada riwayat perhitungan</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => onSelectHistory(item)}
              title="Klik untuk gunakan kembali"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectHistory(item);
                }
              }}
            >
              <div className="history-item-expr">{item.expression} =</div>
              <div className="history-item-res">{item.result}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
