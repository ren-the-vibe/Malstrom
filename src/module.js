// Base Module class — renders panel with title, body, jacks, knobs, controls

let moduleIdCounter = 0;

export class Module {
  constructor(type, title, options = {}) {
    this.id = `mod-${++moduleIdCounter}`;
    this.type = type;
    this.title = title;
    this.inputs = options.inputs || [];   // [{name, type: 'audio'|'pattern'|'control', label}]
    this.outputs = options.outputs || []; // [{name, type, label}]
    this.knobs = {};
    this.selects = {};
    this.textInputs = {};
    this.el = null;
    this.jackEls = {};  // name -> DOM element
    this.onRemove = null;
    this.onChange = null;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'module';
    el.id = this.id;
    el.dataset.type = this.type;

    // Header
    const header = document.createElement('div');
    header.className = 'module-header';
    const titleEl = document.createElement('span');
    titleEl.className = 'module-title';
    titleEl.textContent = this.title;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'module-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => { if (this.onRemove) this.onRemove(this); };
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    el.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'module-body';

    // Input jacks
    for (const inp of this.inputs) {
      body.appendChild(this._createJackRow(inp, 'input'));
    }

    // Module-specific content (subclass overrides renderBody)
    const content = this.renderBody();
    if (content) body.appendChild(content);

    // Output jacks
    for (const out of this.outputs) {
      body.appendChild(this._createJackRow(out, 'output'));
    }

    el.appendChild(body);
    this.el = el;
    return el;
  }

  renderBody() {
    // Override in subclass
    return null;
  }

  _createJackRow(jack, direction) {
    const row = document.createElement('div');
    row.className = `jack-row ${direction}`;

    const jackEl = document.createElement('div');
    jackEl.className = `jack ${direction} ${jack.type || ''}`;
    jackEl.dataset.moduleId = this.id;
    jackEl.dataset.jackName = jack.name;
    jackEl.dataset.jackDir = direction;
    jackEl.dataset.jackType = jack.type || 'audio';
    this.jackEls[jack.name] = jackEl;

    const label = document.createElement('span');
    label.className = 'jack-label';
    label.textContent = jack.label || jack.name;

    if (direction === 'input') {
      row.appendChild(jackEl);
      row.appendChild(label);
    } else {
      row.appendChild(label);
      row.appendChild(jackEl);
    }

    return row;
  }

  createKnob(name, label, min, max, defaultVal, step = 1) {
    const container = document.createElement('div');
    container.className = 'knob-container';

    const knob = document.createElement('div');
    knob.className = 'knob';
    const indicator = document.createElement('div');
    indicator.className = 'knob-indicator';
    knob.appendChild(indicator);

    const labelEl = document.createElement('div');
    labelEl.className = 'knob-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('div');
    valueEl.className = 'knob-value';

    let value = defaultVal;
    const updateDisplay = () => {
      const normalized = (value - min) / (max - min);
      const angle = -135 + normalized * 270;
      indicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      valueEl.textContent = step < 1 ? value.toFixed(2) : Math.round(value);
    };
    updateDisplay();

    // Drag to adjust
    let dragging = false;
    let startY, startVal;
    knob.addEventListener('mousedown', (e) => {
      dragging = true;
      startY = e.clientY;
      startVal = value;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dy = startY - e.clientY;
      const range = max - min;
      const sensitivity = e.shiftKey ? 0.001 : 0.005;
      value = Math.min(max, Math.max(min, startVal + dy * range * sensitivity));
      if (step >= 1) value = Math.round(value / step) * step;
      else value = Math.round(value / step) * step;
      updateDisplay();
      if (this.onChange) this.onChange();
    });
    window.addEventListener('mouseup', () => { dragging = false; });

    // Double-click to reset
    knob.addEventListener('dblclick', () => {
      value = defaultVal;
      updateDisplay();
      if (this.onChange) this.onChange();
    });

    container.appendChild(knob);
    container.appendChild(labelEl);
    container.appendChild(valueEl);

    this.knobs[name] = { get value() { return value; }, set value(v) { value = v; updateDisplay(); } };
    return container;
  }

  createSelect(name, options, defaultVal) {
    const select = document.createElement('select');
    select.className = 'module-select';
    for (const opt of options) {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (opt === defaultVal) o.selected = true;
      select.appendChild(o);
    }
    select.addEventListener('change', () => { if (this.onChange) this.onChange(); });
    this.selects[name] = select;
    return select;
  }

  createTextInput(name, placeholder, defaultVal = '') {
    const input = document.createElement('textarea');
    input.className = 'module-input';
    input.placeholder = placeholder;
    input.value = defaultVal;
    input.rows = 2;
    input.addEventListener('input', () => { if (this.onChange) this.onChange(); });
    this.textInputs[name] = input;
    return input;
  }

  getConfig() {
    const config = { type: this.type, id: this.id };
    for (const [name, knob] of Object.entries(this.knobs)) {
      config[name] = knob.value;
    }
    for (const [name, select] of Object.entries(this.selects)) {
      config[name] = select.value;
    }
    for (const [name, input] of Object.entries(this.textInputs)) {
      config[name] = input.value;
    }
    return config;
  }

  restoreConfig(config) {
    // Restore selects first (some have cascading dependencies, e.g., sampler bank→sample)
    for (const [name, select] of Object.entries(this.selects)) {
      if (config[name] !== undefined) {
        select.value = config[name];
        select.dispatchEvent(new Event('change'));
      }
    }
    for (const [name, knob] of Object.entries(this.knobs)) {
      if (config[name] !== undefined) knob.value = config[name];
    }
    for (const [name, input] of Object.entries(this.textInputs)) {
      if (config[name] !== undefined) input.value = config[name];
    }
  }

  getJackPosition(jackName) {
    const jackEl = this.jackEls[jackName];
    if (!jackEl) return null;
    const rect = jackEl.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
}
