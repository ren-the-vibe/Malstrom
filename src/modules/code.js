import { Module } from '../module.js';

export class CodeModule extends Module {
  constructor() {
    super('code', 'Code', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
    this.desc = 'Raw strudel code passthrough — type any valid strudel expression';
  }

  renderBody() {
    const div = document.createElement('div');
    const textarea = this.createTextInput('code', '.method(args) or expression', '');
    textarea.rows = 3;
    textarea.style.fontFamily = 'var(--font-mono)';
    textarea.style.fontSize = '11px';
    div.appendChild(textarea);
    return div;
  }

  compile(inputCode) {
    const code = this.textInputs.code?.value?.trim() || '';
    if (!code) return inputCode || null;

    // If code starts with '.', it's a method chain — append to input
    if (code.startsWith('.') && inputCode) {
      return `${inputCode}${code}`;
    }

    // If we have input and code doesn't start with '.', wrap as function call
    if (inputCode) {
      // Check if code looks like a function that should wrap the input
      // e.g., "jux(rev)" → inputCode.jux(rev)
      return `${inputCode}.${code}`;
    }

    // No input — code is a source expression
    return code;
  }
}
