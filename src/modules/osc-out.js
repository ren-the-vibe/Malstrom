import { Module } from '../module.js';

export class OscOutModule extends Module {
  constructor() {
    super('osc-out', 'OSC Out', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: []
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createTextInput('host', 'host:port', '127.0.0.1:57120'));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.osc()`;
  }
}
