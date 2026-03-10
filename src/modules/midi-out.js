import { Module } from '../module.js';

export class MidiOutModule extends Module {
  constructor() {
    super('midi-out', 'MIDI Out', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: []
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('channel', 'Chan', 1, 16, 1, 1));
    div.appendChild(this.createTextInput('device', 'MIDI device name', ''));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    const ch = Math.round(this.knobs.channel.value);
    const device = this.textInputs.device?.value || '';
    let code = `${inputCode}.midi()`;
    if (ch !== 1) code = `${inputCode}.midichan(${ch}).midi()`;
    return code;
  }
}
