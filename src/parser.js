// Parser — converts plain strudel code into structured representation
// for automatic module graph creation

import { MODULE_CATEGORIES } from './modules/index.js';

// Build lookup: strudel method name → module type
let _methodMap = null;

function getMethodMap() {
  if (_methodMap) return _methodMap;
  _methodMap = new Map();

  for (const cat of MODULE_CATEGORIES) {
    for (const mod of cat.modules) {
      // Use strudelName if available
      if (mod.strudelName) {
        _methodMap.set(mod.strudelName, mod.type);
      }
      // Also map the type itself
      _methodMap.set(mod.type, mod.type);
    }
  }

  // Common aliases
  _methodMap.set('s', 'sampler');
  _methodMap.set('note', 'sequence');
  _methodMap.set('n', 'sequence');
  _methodMap.set('sound', 'sampler');
  _methodMap.set('gain', 'gain');
  _methodMap.set('speed', 'speed-mod');
  _methodMap.set('pan', 'pan');
  _methodMap.set('delay', 'delay');
  _methodMap.set('delaytime', 'delay');
  _methodMap.set('rev', 'reverb');
  _methodMap.set('room', 'reverb');
  _methodMap.set('lpf', 'filter');
  _methodMap.set('hpf', 'filter');
  _methodMap.set('vowel', 'vowel');
  _methodMap.set('crush', 'crush');
  _methodMap.set('shape', 'distortion');
  _methodMap.set('coarse', 'coarse');
  _methodMap.set('fast', 'fast');
  _methodMap.set('slow', 'slow');
  _methodMap.set('rev', 'reverb');
  _methodMap.set('jux', 'jux');
  _methodMap.set('chop', 'chop');
  _methodMap.set('striate', 'striate');
  _methodMap.set('slice', 'slice');
  _methodMap.set('loopAt', 'loopat');
  _methodMap.set('fit', 'fit');
  _methodMap.set('scrub', 'scrub');
  _methodMap.set('rib', 'rib');
  _methodMap.set('hurry', 'hurry');
  _methodMap.set('ply', 'ply');
  _methodMap.set('iter', 'iter');
  _methodMap.set('palindrome', 'palindrome');
  _methodMap.set('off', 'off');
  _methodMap.set('every', 'every');
  _methodMap.set('struct', 'struct');
  _methodMap.set('mask', 'mask');
  _methodMap.set('segment', 'segment');
  _methodMap.set('echo', 'echo-mod');
  _methodMap.set('stut', 'echo-mod');
  _methodMap.set('layer', 'layer');
  _methodMap.set('leslie', 'leslie');
  _methodMap.set('djf', 'djf');
  _methodMap.set('squiz', 'squiz');
  _methodMap.set('duck', 'duck');
  _methodMap.set('decay', 'decay');
  _methodMap.set('sustain', 'sustain');
  _methodMap.set('attack', 'attack');
  _methodMap.set('release', 'release');
  _methodMap.set('orbit', 'output');
  _methodMap.set('cutoff', 'filter');
  _methodMap.set('almostNever', 'probability');
  _methodMap.set('rarely', 'probability');
  _methodMap.set('often', 'probability');
  _methodMap.set('almostAlways', 'probability');
  _methodMap.set('sometimes', 'probability');
  _methodMap.set('rib', 'rib');
  _methodMap.set('ribbon', 'rib');
  _methodMap.set('sidechain', 'duck');
  _methodMap.set('distort', 'distortion');

  return _methodMap;
}

/**
 * Maps a strudel method name to a Malstrom module type.
 * Returns null if no match found.
 */
export function methodToModuleType(methodName) {
  if (!methodName) return null;
  const map = getMethodMap();
  return map.get(methodName) || null;
}

/**
 * Parse strudel code into structured representation.
 *
 * @param {string} code - Raw strudel code
 * @returns {{
 *   sampleImports: string[],
 *   cps: number|null,
 *   preamble: string[],
 *   tracks: Array<{name: string, chain: Array<{method: string, args: string, raw: string, modCode: string|null}>}>,
 *   stackArgs: string[]
 * }}
 */
export function parseStrudel(code) {
  const result = {
    sampleImports: [],
    cps: null,
    preamble: [],
    tracks: [],
    stackArgs: []
  };

  // Normalize line endings
  const lines = code.replace(/\r\n/g, '\n');

  // Extract samples() calls
  const sampleRegex = /samples\s*\([^)]+\)/g;
  let match;
  while ((match = sampleRegex.exec(lines)) !== null) {
    result.sampleImports.push(match[0]);
  }

  // Extract setcps()
  const cpsMatch = lines.match(/setcps\s*\(\s*([^)]+)\s*\)/);
  if (cpsMatch) {
    try {
      // Safely evaluate simple arithmetic expressions like 170/60/4
      const expr = cpsMatch[1].trim();
      const cps = safeEvalNumber(expr);
      if (cps !== null) result.cps = cps;
    } catch { /* ignore */ }
  }

  // Extract preamble lines (setGainCurve, etc.)
  const preambleRegex = /^(set\w+\s*\([^)]*\))\s*$/gm;
  while ((match = preambleRegex.exec(lines)) !== null) {
    const line = match[1].trim();
    if (!line.startsWith('setcps') && !line.startsWith('samples')) {
      result.preamble.push(line);
    }
  }

  // Extract const declarations (multi-line aware)
  const constBlocks = extractConstBlocks(lines);
  for (const block of constBlocks) {
    const chain = parseChain(block.body);
    result.tracks.push({
      name: block.name,
      chain
    });
  }

  // Extract stack() call
  const stackMatch = findTopLevelStack(lines);
  if (stackMatch) {
    result.stackArgs = parseStackArgs(stackMatch);
  }

  return result;
}

/**
 * Extract `const name = ...` blocks from code, handling multi-line chains.
 */
function extractConstBlocks(code) {
  const blocks = [];
  const lines = code.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const constMatch = line.match(/^\s*const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.*)/);

    if (constMatch) {
      const name = constMatch[1];
      let body = constMatch[2];

      // Collect continuation lines (lines starting with . or that are indented continuations)
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        // Continuation: starts with whitespace followed by . (method chain)
        // or the previous line ends with operator
        if (/^\s+\./.test(nextLine) || /^\s+[,)]/.test(nextLine)) {
          body += '\n' + nextLine;
          i++;
        } else {
          break;
        }
      }

      blocks.push({ name, body: body.trim() });
    } else {
      i++;
    }
  }

  return blocks;
}

/**
 * Parse a method chain like: s("bd").fast(2).gain(0.8) into method objects.
 * Handles nested parentheses correctly.
 */
function parseChain(chainStr) {
  const methods = [];

  // First, handle the initial call (before any dots)
  // e.g., s("bd") or note("c3 e3 g3")
  let remaining = chainStr.trim();

  // Extract the first call
  const firstCallMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  if (firstCallMatch) {
    const method = firstCallMatch[1];
    const argsStart = firstCallMatch[0].length - 1; // position of opening paren
    const argsEnd = findMatchingParen(remaining, argsStart);
    if (argsEnd !== -1) {
      const args = remaining.substring(argsStart + 1, argsEnd);
      const raw = remaining.substring(0, argsEnd + 1);
      const modCode = isComplexExpression(args) ? args : null;
      methods.push({ method, args, raw, modCode });
      remaining = remaining.substring(argsEnd + 1);
    }
  } else {
    // Might be a bare identifier like `rand`
    const bareMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (bareMatch) {
      methods.push({ method: bareMatch[1], args: '', raw: bareMatch[1], modCode: null });
      remaining = remaining.substring(bareMatch[0].length);
    }
  }

  // Now parse .method(args) chains
  while (remaining.length > 0) {
    remaining = remaining.replace(/^\s*/, ''); // trim leading whitespace/newlines

    const dotMatch = remaining.match(/^\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (dotMatch) {
      const method = dotMatch[1];
      const argsStart = dotMatch[0].length - 1;
      const argsEnd = findMatchingParen(remaining, argsStart);
      if (argsEnd !== -1) {
        const args = remaining.substring(argsStart + 1, argsEnd);
        const raw = remaining.substring(0, argsEnd + 1);
        const modCode = isComplexExpression(args) ? args : null;
        methods.push({ method, args, raw, modCode });
        remaining = remaining.substring(argsEnd + 1);
      } else {
        // Unmatched paren — take rest as raw
        methods.push({ method, args: '', raw: remaining, modCode: null });
        break;
      }
    } else {
      // Try bare method: .method (no parens)
      const bareMethod = remaining.match(/^\.([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (bareMethod) {
        methods.push({ method: bareMethod[1], args: '', raw: bareMethod[0], modCode: null });
        remaining = remaining.substring(bareMethod[0].length);
      } else {
        // No more methods
        break;
      }
    }
  }

  return methods;
}

/**
 * Find the matching closing parenthesis for an opening one.
 */
function findMatchingParen(str, openPos) {
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = openPos; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      if (ch === '\\') { i++; continue; } // skip escaped chars
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1; // no match
}

/**
 * Check if an argument string is a complex expression (contains function calls, operators, etc.)
 * vs a simple literal (number, string, mini-notation).
 */
function isComplexExpression(args) {
  if (!args || !args.trim()) return false;
  const trimmed = args.trim();

  // Simple number
  if (/^-?[\d.]+$/.test(trimmed)) return false;

  // Simple string
  if (/^["'][^"']*["']$/.test(trimmed)) return false;

  // Mini-notation in angle brackets
  if (/^["']<[^>]+>["']$/.test(trimmed)) return false;

  // Contains function calls like irand(16) or method chains
  if (/[a-zA-Z_]\w*\s*\(/.test(trimmed)) return true;

  // Contains operators
  if (/[+\-*/]/.test(trimmed) && !/^["']/.test(trimmed)) return true;

  return false;
}

/**
 * Find the top-level stack() call in the code.
 */
function findTopLevelStack(code) {
  const match = code.match(/\bstack\s*\(/);
  if (!match) return null;

  const start = match.index;
  const parenStart = code.indexOf('(', start);
  const parenEnd = findMatchingParen(code, parenStart);
  if (parenEnd === -1) return null;

  return code.substring(parenStart + 1, parenEnd);
}

/**
 * Parse stack arguments: stack(name1, name2, //name3) → ['name1', 'name2']
 * Commented-out names are excluded.
 */
function parseStackArgs(argsStr) {
  const args = [];
  const parts = argsStr.split(',');

  for (let part of parts) {
    part = part.trim();
    // Skip commented-out args
    if (part.startsWith('//')) continue;
    // Remove inline comments
    const commentIdx = part.indexOf('//');
    if (commentIdx !== -1) part = part.substring(0, commentIdx).trim();
    // Remove trailing whitespace/newlines
    part = part.replace(/\s+/g, '');
    if (part && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(part)) {
      args.push(part);
    }
  }

  return args;
}

/**
 * Safely evaluate simple arithmetic expressions (no function calls).
 */
function safeEvalNumber(expr) {
  // Only allow digits, decimal points, and arithmetic operators
  if (!/^[\d\s+\-*/().]+$/.test(expr)) return null;
  try {
    // Use Function constructor for safe eval of arithmetic
    const result = new Function(`return (${expr})`)();
    return typeof result === 'number' && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}
