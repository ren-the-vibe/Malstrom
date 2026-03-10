import { Module } from '../module.js';

export class PianoRollModule extends Module {
  constructor() {
    super('piano-roll', 'Piano Roll', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'thru' }]
    });
    this.canvas = null;
  }

  renderBody() {
    const div = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'viz-canvas';
    this.canvas.width = 280;
    this.canvas.height = 80;
    div.appendChild(this.canvas);

    // Draw placeholder
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 280, 80);
    ctx.fillStyle = '#444466';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Piano Roll — connect & play', 140, 44);

    return div;
  }

  compile(inputCode) {
    if (!inputCode) return null;
    return `${inputCode}._pianoroll()`;
  }
}
