import { Module } from '../module.js';

if (!window.__malstromModules) window.__malstromModules = new Map();

export class EuclidModule extends Module {
  constructor() {
    super('euclid', 'Euclid', {
      inputs: [{ name: 'in', type: 'pattern', label: 'in' }],
      outputs: [{ name: 'out', type: 'pattern', label: 'out' }]
    });
    this._stepEls = [];
    this._stepIndex = 0;
  }

  renderBody() {
    const div = document.createElement('div');
    const row = document.createElement('div');
    row.className = 'knob-row';
    row.appendChild(this.createKnob('hits', 'Hits', 1, 16, 3, 1));
    row.appendChild(this.createKnob('steps', 'Steps', 1, 16, 8, 1));
    row.appendChild(this.createKnob('rotation', 'Rot', 0, 15, 0, 1));
    div.appendChild(row);

    // Step indicator dots
    this._stepRow = document.createElement('div');
    this._stepRow.className = 'step-row';
    div.appendChild(this._stepRow);

    this._rebuildSteps();

    // Register for trigger events
    window.__malstromModules.set(this.id, this);

    return div;
  }

  _rebuildSteps() {
    this._stepRow.innerHTML = '';
    this._stepEls = [];
    const steps = Math.round(this.knobs.steps?.value || 8);
    const hits = Math.round(this.knobs.hits?.value || 3);
    const rotation = Math.round(this.knobs.rotation?.value || 0);

    // Compute euclidean pattern
    const pattern = this._euclideanPattern(hits, steps, rotation);

    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('div');
      dot.className = 'step-dot';
      if (pattern[i]) dot.classList.add('hit');
      this._stepEls.push(dot);
      this._stepRow.appendChild(dot);
    }
    this._stepIndex = 0;
  }

  _euclideanPattern(hits, steps, rotation) {
    if (hits >= steps) return new Array(steps).fill(true);
    const pattern = [];
    for (let i = 0; i < steps; i++) {
      pattern.push(Math.floor((i * hits) / steps) !== Math.floor(((i - 1) * hits) / steps) || i === 0);
    }
    // Rotate
    if (rotation > 0) {
      const r = rotation % steps;
      return [...pattern.slice(r), ...pattern.slice(0, r)];
    }
    return pattern;
  }

  flashTrigger() {
    if (this._stepEls.length === 0) return;
    // Clear previous
    this._stepEls.forEach(el => el.classList.remove('triggered'));
    const el = this._stepEls[this._stepIndex % this._stepEls.length];
    if (el) el.classList.add('triggered');
    this._stepIndex++;
    if (this._stepIndex >= this._stepEls.length) this._stepIndex = 0;
  }

  resetTrigger() {
    this._stepIndex = 0;
    this._stepEls.forEach(el => el.classList.remove('triggered'));
  }

  compile(inputCode) {
    const hits = Math.round(this.knobs.hits.value);
    const steps = Math.round(this.knobs.steps.value);
    const rotation = Math.round(this.knobs.rotation.value);

    // Rebuild step visualization when knobs change
    this._rebuildSteps();

    const euclidCall = rotation > 0
      ? `.euclid(${hits}, ${steps}, ${rotation})`
      : `.euclid(${hits}, ${steps})`;
    return inputCode ? `${inputCode}${euclidCall}` : `note("c3")${euclidCall}`;
  }
}
