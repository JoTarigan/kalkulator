import React from 'react';

interface KeypadProps {
  isScientific: boolean;
  activeOperator: string | null;
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onEquals: () => void;
  onScientificFunc: (fn: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  isScientific,
  activeOperator,
  onDigit,
  onOperator,
  onClear,
  onDelete,
  onToggleSign,
  onPercent,
  onEquals,
  onScientificFunc,
}) => {
  if (isScientific) {
    return (
      <div className="calc-keypad scientific-grid" role="group" aria-label="Tombol kalkulator saintifik">
        {/* Row 1 */}
        <button type="button" id="btn-sin" className="btn-calc btn-scientific" onClick={() => onScientificFunc('sin')}>
          sin
        </button>
        <button type="button" id="btn-cos" className="btn-calc btn-scientific" onClick={() => onScientificFunc('cos')}>
          cos
        </button>
        <button type="button" id="btn-tan" className="btn-calc btn-scientific" onClick={() => onScientificFunc('tan')}>
          tan
        </button>
        <button type="button" id="btn-paren-open" className="btn-calc btn-scientific" onClick={() => onDigit('(')}>
          (
        </button>
        <button type="button" id="btn-paren-close" className="btn-calc btn-scientific" onClick={() => onDigit(')')}>
          )
        </button>

        {/* Row 2 */}
        <button type="button" id="btn-sqrt" className="btn-calc btn-scientific" onClick={() => onScientificFunc('sqrt')}>
          √
        </button>
        <button type="button" id="btn-sqr" className="btn-calc btn-scientific" onClick={() => onScientificFunc('sqr')}>
          x²
        </button>
        <button type="button" id="btn-pow" className="btn-calc btn-scientific" onClick={() => onOperator('^')}>
          xʸ
        </button>
        <button type="button" id="btn-ac" className="btn-calc btn-function btn-clear" onClick={onClear}>
          AC
        </button>
        <button type="button" id="btn-del" className="btn-calc btn-function" onClick={onDelete}>
          ⌫
        </button>

        {/* Row 3 */}
        <button type="button" id="btn-log" className="btn-calc btn-scientific" onClick={() => onScientificFunc('log')}>
          log
        </button>
        <button type="button" id="btn-ln" className="btn-calc btn-scientific" onClick={() => onScientificFunc('ln')}>
          ln
        </button>
        <button type="button" id="btn-percent" className="btn-calc btn-function" onClick={onPercent}>
          %
        </button>
        <button type="button" id="btn-sign" className="btn-calc btn-function" onClick={onToggleSign}>
          ±
        </button>
        <button
          type="button"
          id="btn-divide"
          className={`btn-calc btn-operator ${activeOperator === '÷' ? 'active-op' : ''}`}
          onClick={() => onOperator('÷')}
        >
          ÷
        </button>

        {/* Row 4 */}
        <button type="button" id="btn-pi" className="btn-calc btn-scientific" onClick={() => onDigit('π')}>
          π
        </button>
        <button type="button" id="btn-7" className="btn-calc btn-number" onClick={() => onDigit('7')}>
          7
        </button>
        <button type="button" id="btn-8" className="btn-calc btn-number" onClick={() => onDigit('8')}>
          8
        </button>
        <button type="button" id="btn-9" className="btn-calc btn-number" onClick={() => onDigit('9')}>
          9
        </button>
        <button
          type="button"
          id="btn-multiply"
          className={`btn-calc btn-operator ${activeOperator === '×' ? 'active-op' : ''}`}
          onClick={() => onOperator('×')}
        >
          ×
        </button>

        {/* Row 5 */}
        <button type="button" id="btn-e" className="btn-calc btn-scientific" onClick={() => onDigit('e')}>
          e
        </button>
        <button type="button" id="btn-4" className="btn-calc btn-number" onClick={() => onDigit('4')}>
          4
        </button>
        <button type="button" id="btn-5" className="btn-calc btn-number" onClick={() => onDigit('5')}>
          5
        </button>
        <button type="button" id="btn-6" className="btn-calc btn-number" onClick={() => onDigit('6')}>
          6
        </button>
        <button
          type="button"
          id="btn-subtract"
          className={`btn-calc btn-operator ${activeOperator === '−' ? 'active-op' : ''}`}
          onClick={() => onOperator('−')}
        >
          −
        </button>

        {/* Row 6 */}
        <button type="button" id="btn-recip" className="btn-calc btn-scientific" onClick={() => onScientificFunc('1/x')}>
          1/x
        </button>
        <button type="button" id="btn-1" className="btn-calc btn-number" onClick={() => onDigit('1')}>
          1
        </button>
        <button type="button" id="btn-2" className="btn-calc btn-number" onClick={() => onDigit('2')}>
          2
        </button>
        <button type="button" id="btn-3" className="btn-calc btn-number" onClick={() => onDigit('3')}>
          3
        </button>
        <button
          type="button"
          id="btn-add"
          className={`btn-calc btn-operator ${activeOperator === '+' ? 'active-op' : ''}`}
          onClick={() => onOperator('+')}
        >
          +
        </button>

        {/* Row 7 */}
        <button type="button" id="btn-0" className="btn-calc btn-number" onClick={() => onDigit('0')}>
          0
        </button>
        <button type="button" id="btn-dot" className="btn-calc btn-number" onClick={() => onDigit('.')}>
          .
        </button>
        <button
          type="button"
          id="btn-equals"
          className="btn-calc btn-equals"
          style={{ gridColumn: 'span 3' }}
          onClick={onEquals}
        >
          =
        </button>
      </div>
    );
  }

  // Standard Mode
  return (
    <div className="calc-keypad" role="group" aria-label="Tombol kalkulator standar">
      {/* Row 1 */}
      <button type="button" id="btn-ac" className="btn-calc btn-function btn-clear" onClick={onClear}>
        AC
      </button>
      <button type="button" id="btn-del" className="btn-calc btn-function" onClick={onDelete}>
        ⌫
      </button>
      <button type="button" id="btn-percent" className="btn-calc btn-function" onClick={onPercent}>
        %
      </button>
      <button
        type="button"
        id="btn-divide"
        className={`btn-calc btn-operator ${activeOperator === '÷' ? 'active-op' : ''}`}
        onClick={() => onOperator('÷')}
      >
        ÷
      </button>

      {/* Row 2 */}
      <button type="button" id="btn-7" className="btn-calc btn-number" onClick={() => onDigit('7')}>
        7
      </button>
      <button type="button" id="btn-8" className="btn-calc btn-number" onClick={() => onDigit('8')}>
        8
      </button>
      <button type="button" id="btn-9" className="btn-calc btn-number" onClick={() => onDigit('9')}>
        9
      </button>
      <button
        type="button"
        id="btn-multiply"
        className={`btn-calc btn-operator ${activeOperator === '×' ? 'active-op' : ''}`}
        onClick={() => onOperator('×')}
      >
        ×
      </button>

      {/* Row 3 */}
      <button type="button" id="btn-4" className="btn-calc btn-number" onClick={() => onDigit('4')}>
        4
      </button>
      <button type="button" id="btn-5" className="btn-calc btn-number" onClick={() => onDigit('5')}>
        5
      </button>
      <button type="button" id="btn-6" className="btn-calc btn-number" onClick={() => onDigit('6')}>
        6
      </button>
      <button
        type="button"
        id="btn-subtract"
        className={`btn-calc btn-operator ${activeOperator === '−' ? 'active-op' : ''}`}
        onClick={() => onOperator('−')}
      >
        −
      </button>

      {/* Row 4 */}
      <button type="button" id="btn-1" className="btn-calc btn-number" onClick={() => onDigit('1')}>
        1
      </button>
      <button type="button" id="btn-2" className="btn-calc btn-number" onClick={() => onDigit('2')}>
        2
      </button>
      <button type="button" id="btn-3" className="btn-calc btn-number" onClick={() => onDigit('3')}>
        3
      </button>
      <button
        type="button"
        id="btn-add"
        className={`btn-calc btn-operator ${activeOperator === '+' ? 'active-op' : ''}`}
        onClick={() => onOperator('+')}
      >
        +
      </button>

      {/* Row 5 */}
      <button type="button" id="btn-sign" className="btn-calc btn-function" onClick={onToggleSign}>
        ±
      </button>
      <button type="button" id="btn-0" className="btn-calc btn-number" onClick={() => onDigit('0')}>
        0
      </button>
      <button type="button" id="btn-dot" className="btn-calc btn-number" onClick={() => onDigit('.')}>
        .
      </button>
      <button type="button" id="btn-equals" className="btn-calc btn-equals" onClick={onEquals}>
        =
      </button>
    </div>
  );
};
