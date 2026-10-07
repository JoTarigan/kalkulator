// Safe mathematical expression evaluator and utilities

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type AngleMode = 'DEG' | 'RAD';

// Format floating numbers cleanly
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // If number is very large or very small, use scientific notation
  const abs = Math.abs(num);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-7)) && !Number.isInteger(num)) {
    return num.toExponential(6).replace(/e\+?/, 'e');
  }

  // Format to 10 decimal precision and remove trailing zeros
  const rounded = parseFloat(num.toPrecision(12));
  return String(rounded);
}

// Factorial calculation
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // overflow for JS standard Number
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Convert expression display symbols to parsable tokens
// e.g. '×' -> '*', '÷' -> '/', '−' -> '-'
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): number {
  // Normalize symbols
  let cleaned = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, `(${Math.PI})`)
    .replace(/\be\b/g, `(${Math.E})`);

  // Handle scientific functions safely using Math
  // Replace DEG conversions if in DEG mode
  const degToRad = (val: number) => (angleMode === 'DEG' ? (val * Math.PI) / 180 : val);

  // We can evaluate token stream using recursive descent or a safe parser
  return safeMathEval(cleaned, degToRad);
}

// Safe expression parser (Recursive Descent Parser for: +, -, *, /, %, ^, unary -, parentheses, functions)
function safeMathEval(expr: string, degToRad: (v: number) => number): number {
  let pos = 0;

  function peek(): string {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
    return pos < expr.length ? expr[pos] : '';
  }

  function get(): string {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
    return pos < expr.length ? expr[pos++] : '';
  }

  function parseExpression(): number {
    let result = parseTerm();
    while (true) {
      const char = peek();
      if (char === '+') {
        get();
        result += parseTerm();
      } else if (char === '-') {
        get();
        result -= parseTerm();
      } else {
        break;
      }
    }
    return result;
  }

  function parseTerm(): number {
    let result = parseFactor();
    while (true) {
      const char = peek();
      if (char === '*') {
        get();
        result *= parseFactor();
      } else if (char === '/') {
        get();
        const divisor = parseFactor();
        if (divisor === 0) throw new Error('Division by zero');
        result /= divisor;
      } else if (char === '%') {
        get();
        result %= parseFactor();
      } else {
        break;
      }
    }
    return result;
  }

  function parseFactor(): number {
    let result = parseUnary();
    if (peek() === '^') {
      get();
      const exponent = parseFactor(); // right-associative
      result = Math.pow(result, exponent);
    }
    return result;
  }

  function parseUnary(): number {
    const char = peek();
    if (char === '-') {
      get();
      return -parseUnary();
    }
    if (char === '+') {
      get();
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    // Check for functions: sin, cos, tan, sqrt, log, ln
    const remaining = expr.slice(pos);
    const fnMatch = remaining.match(/^(sin|cos|tan|sqrt|log|ln|abs|asin|acos|atan)\b/);

    if (fnMatch) {
      const fnName = fnMatch[1];
      pos += fnName.length;
      if (get() !== '(') throw new Error(`Missing '(' after ${fnName}`);
      const arg = parseExpression();
      if (get() !== ')') throw new Error(`Missing ')' after argument`);

      switch (fnName) {
        case 'sin':
          return Math.sin(degToRad(arg));
        case 'cos':
          return Math.cos(degToRad(arg));
        case 'tan': {
          const val = Math.tan(degToRad(arg));
          if (Math.abs(val) > 1e14) throw new Error('Invalid tangent value');
          return val;
        }
        case 'sqrt':
          if (arg < 0) throw new Error('Square root of negative number');
          return Math.sqrt(arg);
        case 'log':
          if (arg <= 0) throw new Error('Log of non-positive number');
          return Math.log10(arg);
        case 'ln':
          if (arg <= 0) throw new Error('Ln of non-positive number');
          return Math.log(arg);
        case 'abs':
          return Math.abs(arg);
        default:
          throw new Error(`Unknown function: ${fnName}`);
      }
    }

    if (peek() === '(') {
      get(); // consume '('
      const result = parseExpression();
      if (get() !== ')') throw new Error("Missing ')'");
      return result;
    }

    // Parse number
    const start = pos;
    while (pos < expr.length && (/[0-9.]/.test(expr[pos]) || (expr[pos] === 'e' && /[0-9+-]/.test(expr[pos + 1] || '')))) {
      pos++;
    }

    if (start === pos) {
      throw new Error(`Unexpected token at position ${pos}: '${peek()}'`);
    }

    const numStr = expr.slice(start, pos);
    const num = Number(numStr);
    if (isNaN(num)) throw new Error(`Invalid number '${numStr}'`);
    return num;
  }

  const ans = parseExpression();
  if (pos < expr.length) {
    throw new Error(`Extra characters in expression: '${expr.slice(pos)}'`);
  }
  return ans;
}
