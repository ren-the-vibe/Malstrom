import { Module } from '../module.js';

export class MiniModule extends Module {
  constructor() {
    super('mini', 'Mini', {
      inputs: [],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    const input = this.createTextInput('code', 'mini notation...', 'c3 [e3 g3] c4');
    input.rows = 3;
    div.appendChild(input);
    return div;
  }

  compile() {
    const code = this.textInputs.code?.value || '';
    if (!code.trim()) return null;
    return `mini("${code.trim()}")`;
  }
}
