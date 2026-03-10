import { Module } from '../module.js';

export class ScopeModule extends Module {
  constructor() {
    super('scope', 'Scope', {
      inputs: [{ name: 'in', type: 'audio', label: 'in' }],
      outputs: [{ name: 'out', type: 'audio', label: 'thru' }]
    });
    this.canvas = null;
    this.analyser = null;
    this.animFrame = null;
  }

  renderBody() {
    const div = document.createElement('div');
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'viz-canvas';
    this.canvas.width = 280;
    this.canvas.height = 80;
    div.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 280, 80);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(280, 40);
    ctx.stroke();
    ctx.fillStyle = '#444466';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Oscilloscope', 140, 44);

    return div;
  }

  compile(inputCode) {
    return inputCode || null;
  }
}
