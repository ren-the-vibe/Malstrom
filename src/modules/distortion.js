import { Module } from '../module.js';

export class DistortionModule extends Module {
  constructor() {
    super('distortion', 'Distortion', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'out' }]
    });
  }

  renderBody() {
    const div = document.createElement('div');
    div.appendChild(this.createKnob('drive', 'Drive', 0, 1, 0.5, 0.05));
    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}.distort(${this.knobs.drive.value})`;
  }
}
