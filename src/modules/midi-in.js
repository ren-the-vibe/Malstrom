import { Module } from '../module.js';

export class MidiInModule extends Module {
  constructor() {
    super('midi-in', 'MIDI In', {
      inputs: [],
      outputs: [{ name: 'out', type: 'control', label: 'cc out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('cc', 'CC#', 0, 127, 1, 1));
    div.appendChild(this.createKnob('channel', 'Chan', 1, 16, 1, 1));
    return div;
  }

  compile() {
    const cc = Math.round(this.knobs.cc.value);
    const ch = Math.round(this.knobs.channel.value);
    return `ccv(${cc})`;
  }
}
