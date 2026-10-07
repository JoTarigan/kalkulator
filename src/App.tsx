import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  evaluateExpression,
  formatResult,
  type HistoryItem,
  type AngleMode,
} from './utils/calculator';
import { playClickSound } from './utils/sound';

export const App: React.FC = () => {
  // Persistence state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aura_theme') as 'dark' | 'light') || 'dark';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('aura_sound');
    return saved !== null ? saved === 'true' : true;
  });

  const [isScientific, setIsScientific] = useState<boolean>(() => {
    return localStorage.getItem('aura_scientific') === 'true';
  });

  const [angleMode, setAngleMode] = useState<AngleMode>(() => {
    return (localStorage.getItem('aura_angle_mode') as AngleMode) || 'DEG';
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculator interaction state
  const [expression, setExpression] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [activeOperator, setActiveOperator] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme to root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aura_theme', theme);
  }, [theme]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('aura_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('aura_scientific', String(isScientific));
  }, [isScientific]);

  useEffect(() => {
    localStorage.setItem('aura_angle_mode', angleMode);
  }, [angleMode]);

  useEffect(() => {
    localStorage.setItem('aura_history', JSON.stringify(history));
  }, [history]);

  // Show toast utility
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleDigit = useCallback(
    (digit: string) => {
      playClickSound('click', soundEnabled);
      setActiveOperator(null);

      if (digit === '.') {
        if (overwrite) {
          setCurrentInput('0.');
          setOverwrite(false);
          return;
        }
        if (!currentInput.includes('.')) {
          setCurrentInput((prev) => prev + '.');
        }
        return;
      }

      if (digit === '(' || digit === ')') {
        if (overwrite || currentInput === '0') {
          setCurrentInput(digit);
          setOverwrite(false);
        } else {
          setCurrentInput((prev) => prev + digit);
        }
        return;
      }

      if (digit === 'π' || digit === 'e') {
        setCurrentInput(digit);
        setOverwrite(true);
        return;
      }

      if (overwrite || currentInput === '0') {
        setCurrentInput(digit);
        setOverwrite(false);
      } else {
        // Limit digit length to 16
        if (currentInput.replace(/[^0-9]/g, '').length < 16) {
          setCurrentInput((prev) => prev + digit);
        }
      }
    },
    [overwrite, currentInput, soundEnabled]
  );

  const handleOperator = useCallback(
    (op: string) => {
      playClickSound('operator', soundEnabled);
      setActiveOperator(op);

      // If user had finished an evaluation and presses an operator, continue with result
      if (expression.includes('=')) {
        setExpression(`${currentInput} ${op} `);
        setOverwrite(true);
        return;
      }

      // If currently awaiting next number but presses a different operator, replace previous operator
      if (overwrite && expression.length > 0) {
        const trimmed = expression.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace !== -1) {
          setExpression(`${trimmed.substring(0, lastSpace)} ${op} `);
          return;
        }
      }

      setExpression((prev) => `${prev}${currentInput} ${op} `);
      setOverwrite(true);
    },
    [expression, currentInput, overwrite, soundEnabled]
  );

  const handleClear = useCallback(() => {
    playClickSound('clear', soundEnabled);
    setCurrentInput('0');
    setExpression('');
    setActiveOperator(null);
    setOverwrite(true);
  }, [soundEnabled]);

  const handleDelete = useCallback(() => {
    playClickSound('click', soundEnabled);
    if (overwrite) return;

    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
      setCurrentInput('0');
      setOverwrite(true);
    } else {
      setCurrentInput((prev) => prev.slice(0, -1));
    }
  }, [overwrite, currentInput, soundEnabled]);

  const handleToggleSign = useCallback(() => {
    playClickSound('click', soundEnabled);
    if (currentInput === '0' || currentInput === 'Error') return;

    if (currentInput.startsWith('-')) {
      setCurrentInput((prev) => prev.slice(1));
    } else {
      setCurrentInput((prev) => '-' + prev);
    }
  }, [currentInput, soundEnabled]);

  const handlePercent = useCallback(() => {
    playClickSound('click', soundEnabled);
    try {
      const val = parseFloat(currentInput);
      if (!isNaN(val)) {
        const res = formatResult(val / 100);
        setCurrentInput(res);
        setOverwrite(true);
      }
    } catch {
      playClickSound('error', soundEnabled);
      setCurrentInput('Error');
    }
  }, [currentInput, soundEnabled]);

  const handleEquals = useCallback(() => {
    if (expression.includes('=')) {
      // Repeat calculation if needed or do nothing
      return;
    }

    const fullExpr = `${expression}${currentInput}`.trim();
    if (!fullExpr) return;

    try {
      const resultNum = evaluateExpression(fullExpr, angleMode);
      const formatted = formatResult(resultNum);

      if (formatted === 'Error' || formatted === 'Infinity' || formatted === '-Infinity') {
        playClickSound('error', soundEnabled);
      } else {
        playClickSound('equals', soundEnabled);
      }

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: fullExpr,
        result: formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
      setExpression(`${fullExpr} =`);
      setCurrentInput(formatted);
      setActiveOperator(null);
      setOverwrite(true);
    } catch {
      playClickSound('error', soundEnabled);
      setCurrentInput('Error');
      setOverwrite(true);
    }
  }, [expression, currentInput, angleMode, soundEnabled]);

  const handleScientificFunc = useCallback(
    (fn: string) => {
      playClickSound('operator', soundEnabled);
      try {
        let val = 0;
        if (currentInput === 'π') val = Math.PI;
        else if (currentInput === 'e') val = Math.E;
        else val = parseFloat(currentInput);

        if (isNaN(val)) {
          setCurrentInput('Error');
          setOverwrite(true);
          return;
        }

        let res = 0;
        let displayExpr = '';

        const toRad = (deg: number) => (angleMode === 'DEG' ? (deg * Math.PI) / 180 : deg);

        switch (fn) {
          case 'sin':
            res = Math.sin(toRad(val));
            displayExpr = `sin(${currentInput})`;
            break;
          case 'cos':
            res = Math.cos(toRad(val));
            displayExpr = `cos(${currentInput})`;
            break;
          case 'tan': {
            res = Math.tan(toRad(val));
            if (Math.abs(res) > 1e14) throw new Error('Invalid');
            displayExpr = `tan(${currentInput})`;
            break;
          }
          case 'sqrt':
            if (val < 0) throw new Error('Invalid');
            res = Math.sqrt(val);
            displayExpr = `√(${currentInput})`;
            break;
          case 'sqr':
            res = val * val;
            displayExpr = `sqr(${currentInput})`;
            break;
          case 'log':
            if (val <= 0) throw new Error('Invalid');
            res = Math.log10(val);
            displayExpr = `log(${currentInput})`;
            break;
          case 'ln':
            if (val <= 0) throw new Error('Invalid');
            res = Math.log(val);
            displayExpr = `ln(${currentInput})`;
            break;
          case '1/x':
            if (val === 0) throw new Error('Division by zero');
            res = 1 / val;
            displayExpr = `1/(${currentInput})`;
            break;
          default:
            return;
        }

        const formatted = formatResult(res);
        setExpression(displayExpr);
        setCurrentInput(formatted);
        setOverwrite(true);

        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          expression: displayExpr,
          result: formatted,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
      } catch {
        playClickSound('error', soundEnabled);
        setCurrentInput('Error');
        setOverwrite(true);
      }
    },
    [currentInput, angleMode, soundEnabled]
  );

  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentInput);
      showToast(`Tersalin: ${currentInput}`);
      playClickSound('click', soundEnabled);
    }
  }, [currentInput, showToast, soundEnabled]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentInput(item.result);
    setExpression(item.expression + ' =');
    setOverwrite(true);
    setIsHistoryOpen(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    showToast('Semua riwayat dibersihkan');
  }, [showToast]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or modal
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        handleDigit(key);
      } else if (key === '.' || key === ',') {
        handleDigit('.');
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('−');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === '^') {
        handleOperator('^');
      } else if (key === '(' || key === ')') {
        handleDigit(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === '%') {
        handlePercent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleDelete, handleClear, handlePercent]);

  return (
    <>
      <div className="ambient-glow" aria-hidden="true" />

      <main className={`calculator-app ${isScientific ? 'mode-scientific' : ''}`}>
        <div className="calc-card">
          <Header
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            isScientific={isScientific}
            onToggleScientific={() => setIsScientific((s) => !s)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
            angleMode={angleMode}
            onToggleAngleMode={() => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'))}
          />

          <Display
            expression={expression}
            currentInput={currentInput}
            isScientific={isScientific}
            angleMode={angleMode}
            onCopy={handleCopy}
          />

          <Keypad
            isScientific={isScientific}
            activeOperator={activeOperator}
            onDigit={handleDigit}
            onOperator={handleOperator}
            onClear={handleClear}
            onDelete={handleDelete}
            onToggleSign={handleToggleSign}
            onPercent={handlePercent}
            onEquals={handleEquals}
            onScientificFunc={handleScientificFunc}
          />

          <HistoryDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
          />
        </div>

        <footer className="calc-footer">
          <div className="calc-footer-shortcuts">
            <span>Keyboard:</span>
            <span className="shortcut-kbd">0-9</span>
            <span className="shortcut-kbd">+ - * /</span>
            <span className="shortcut-kbd">Enter (=)</span>
            <span className="shortcut-kbd">Backspace</span>
            <span className="shortcut-kbd">Esc (AC)</span>
          </div>
        </footer>
      </main>

      {toastMessage && (
        <div className="toast-notice" role="status" aria-live="polite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default App;
