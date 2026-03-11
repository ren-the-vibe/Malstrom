// Base Module class — renders panel with title, body, jacks, knobs, controls

let moduleIdCounter = 0;

export class Module {
  constructor(type, title, options = {}) {
    this.id = `mod-${++moduleIdCounter}`;
    this.type = type;
    this.title = title;
    this.strudelName = options.strudelName || null;
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
    if (this.strudelName) {
      const tag = document.createElement('span');
      tag.className = 'strudel-tag';
      tag.textContent = `.${this.strudelName}()`;
      titleEl.appendChild(tag);
    }
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    if (this.desc) header.title = this.desc;
    el.appendChild(header);

    // Drag-to-reorder on header
    this._initDrag(header, el);

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
    const clamp = () => { value = Math.min(max, Math.max(min, value)); };
    const snap = () => { value = Math.round(value / step) * step; };
    const updateDisplay = () => {
      const normalized = (value - min) / (max - min);
      const angle = -135 + normalized * 270;
      indicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      valueEl.textContent = step < 1 ? value.toFixed(2) : Math.round(value);
    };
    updateDisplay();

    // Drag to adjust
    let dragging = false;
    let locked = false;
    let startY, startVal;
    knob.addEventListener('mousedown', (e) => {
      if (locked) return;
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
      value = startVal + dy * range * sensitivity;
      clamp(); snap();
      updateDisplay();
      if (this.onChange) this.onChange();
    });
    window.addEventListener('mouseup', () => { dragging = false; });

    // Double-click to reset
    knob.addEventListener('dblclick', () => {
      if (locked) return;
      value = defaultVal;
      updateDisplay();
      if (this.onChange) this.onChange();
    });

    // Right-click on knob or label to edit range
    const showRangeEditor = (e) => {
      e.preventDefault();
      if (locked) return;
      // Remove any existing editor
      container.querySelector('.knob-range-editor')?.remove();

      const editor = document.createElement('div');
      editor.className = 'knob-range-editor';

      const minInput = document.createElement('input');
      minInput.type = 'number';
      minInput.value = min;
      minInput.step = step;
      minInput.placeholder = 'min';

      const sep = document.createElement('span');
      sep.textContent = '\u2013';
      sep.style.color = 'var(--text-dim)';

      const maxInput = document.createElement('input');
      maxInput.type = 'number';
      maxInput.value = max;
      maxInput.step = step;
      maxInput.placeholder = 'max';

      editor.appendChild(minInput);
      editor.appendChild(sep);
      editor.appendChild(maxInput);
      container.appendChild(editor);

      minInput.focus();
      minInput.select();

      const applyRange = () => {
        const newMin = parseFloat(minInput.value);
        const newMax = parseFloat(maxInput.value);
        if (!isNaN(newMin) && !isNaN(newMax) && newMin < newMax) {
          min = newMin;
          max = newMax;
          clamp(); snap();
          updateDisplay();
          if (this.onChange) this.onChange();
        }
        editor.remove();
      };

      const onKey = (e) => {
        if (e.key === 'Enter') applyRange();
        if (e.key === 'Escape') editor.remove();
      };
      minInput.addEventListener('keydown', onKey);
      maxInput.addEventListener('keydown', onKey);
      // Close on outside click
      setTimeout(() => {
        const close = (e) => {
          if (!editor.contains(e.target)) { applyRange(); document.removeEventListener('mousedown', close); }
        };
        document.addEventListener('mousedown', close);
      }, 0);
    };
    knob.addEventListener('contextmenu', showRangeEditor);
    labelEl.addEventListener('contextmenu', showRangeEditor);
    valueEl.addEventListener('contextmenu', showRangeEditor);

    container.appendChild(knob);
    container.appendChild(labelEl);
    container.appendChild(valueEl);

    this.knobs[name] = {
      get value() { return value; },
      set value(v) {
        value = Math.min(max, Math.max(min, v));
        snap();
        updateDisplay();
      },
      lock() {
        locked = true;
        container.classList.add('mod-locked');
        valueEl.textContent = 'MOD';
      },
      unlock() {
        locked = false;
        container.classList.remove('mod-locked');
        updateDisplay();
      },
      get isLocked() { return locked; },
      get min() { return min; },
      get max() { return max; }
    };
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

  // Lock/unlock the primary knob when a mod cable is connected/disconnected.
  // Subclasses can override modKnobName to specify which knob is controlled by mod.
  get modKnobName() {
    // Default: first knob
    const names = Object.keys(this.knobs);
    return names.length > 0 ? names[0] : null;
  }

  setModLocked(locked) {
    const knobName = this.modKnobName;
    if (!knobName || !this.knobs[knobName]) return;
    if (locked) {
      this.knobs[knobName].lock();
    } else {
      this.knobs[knobName].unlock();
    }
  }

  _initDrag(handle, el) {
    let dragging = false;
    let ghost = null;
    let placeholder = null;
    let offsetX, offsetY;
    let rackEl = null;

    handle.addEventListener('mousedown', (e) => {
      // Only left-click, and not on close button
      if (e.button !== 0 || e.target.closest('.module-close')) return;
      e.preventDefault();

      rackEl = el.parentElement;
      if (!rackEl) return;

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Create placeholder to hold space in flow
      placeholder = document.createElement('div');
      placeholder.className = 'module-placeholder';
      placeholder.style.width = rect.width + 'px';
      placeholder.style.height = rect.height + 'px';
      rackEl.insertBefore(placeholder, el);

      // Make module a floating ghost
      ghost = el;
      ghost.classList.add('dragging');
      ghost.style.position = 'fixed';
      ghost.style.left = rect.left + 'px';
      ghost.style.top = rect.top + 'px';
      ghost.style.width = rect.width + 'px';
      ghost.style.zIndex = '1000';

      dragging = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging || !ghost) return;

      ghost.style.left = (e.clientX - offsetX) + 'px';
      ghost.style.top = (e.clientY - offsetY) + 'px';

      // Find insertion point among siblings
      const siblings = Array.from(rackEl.children).filter(
        c => c !== ghost && c.classList.contains('module') || c === placeholder
      );
      let target = null;
      for (const sib of siblings) {
        if (sib === placeholder) continue;
        const r = sib.getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2 && e.clientY < r.bottom) {
          target = sib;
          break;
        }
        if (e.clientY < r.top + r.height / 2) {
          target = sib;
          break;
        }
      }
      // Move placeholder to target position
      if (target) {
        rackEl.insertBefore(placeholder, target);
      } else {
        rackEl.appendChild(placeholder);
      }
    });

    window.addEventListener('mouseup', () => {
      if (!dragging || !ghost) return;
      dragging = false;

      // Restore module to flow at placeholder position
      ghost.classList.remove('dragging');
      ghost.style.position = '';
      ghost.style.left = '';
      ghost.style.top = '';
      ghost.style.width = '';
      ghost.style.zIndex = '';

      if (placeholder && placeholder.parentElement) {
        rackEl.insertBefore(ghost, placeholder);
        placeholder.remove();
      }
      placeholder = null;
      ghost = null;

      // Refresh cable positions after reorder
      if (this._onDragEnd) this._onDragEnd();
    });
  }

  getJackPosition(jackName) {
    const jackEl = this.jackEls[jackName];
    if (!jackEl) return null;
    const rect = jackEl.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
}
