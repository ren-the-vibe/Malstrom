// Channel — horizontal strip of modules forming one signal chain
// Compiles to: const channelName = module1.method1().method2()...

let channelIdCounter = 0;

export class Channel {
  constructor(name = 'track') {
    this.id = `ch-${++channelIdCounter}`;
    this.name = name;
    this.muted = false;
    this.solo = false;
    this.el = null;
    this._modulesEl = null;
    this._nameInput = null;
    this.onRemove = null;
    this.onNameChange = null;
    this.onMuteToggle = null;
    this.onSoloToggle = null;
    this.onModuleDrop = null; // called when module is dropped into this channel
  }

  render() {
    const el = document.createElement('div');
    el.className = 'channel';
    el.id = this.id;
    if (this.muted) el.classList.add('muted');

    // Header (left side)
    const header = document.createElement('div');
    header.className = 'channel-header';

    const nameInput = document.createElement('input');
    nameInput.className = 'channel-name';
    nameInput.type = 'text';
    nameInput.value = this.name;
    nameInput.spellcheck = false;
    nameInput.addEventListener('change', () => {
      // Sanitize: valid JS identifier
      const raw = nameInput.value.trim().replace(/[^a-zA-Z0-9_]/g, '_') || 'track';
      this.name = raw;
      nameInput.value = raw;
      if (this.onNameChange) this.onNameChange(this);
    });
    this._nameInput = nameInput;
    header.appendChild(nameInput);

    const btnRow = document.createElement('div');
    btnRow.className = 'channel-btn-row';

    const muteBtn = document.createElement('button');
    muteBtn.className = 'channel-btn mute-btn';
    muteBtn.textContent = 'M';
    muteBtn.title = 'Mute';
    muteBtn.addEventListener('click', () => {
      this.muted = !this.muted;
      el.classList.toggle('muted', this.muted);
      muteBtn.classList.toggle('active', this.muted);
      if (this.onMuteToggle) this.onMuteToggle(this);
    });
    btnRow.appendChild(muteBtn);

    const soloBtn = document.createElement('button');
    soloBtn.className = 'channel-btn solo-btn';
    soloBtn.textContent = 'S';
    soloBtn.title = 'Solo';
    soloBtn.addEventListener('click', () => {
      this.solo = !this.solo;
      soloBtn.classList.toggle('active', this.solo);
      if (this.onSoloToggle) this.onSoloToggle(this);
    });
    btnRow.appendChild(soloBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'channel-btn delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete channel';
    deleteBtn.addEventListener('click', () => {
      if (this.onRemove) this.onRemove(this);
    });
    btnRow.appendChild(deleteBtn);

    header.appendChild(btnRow);
    el.appendChild(header);

    // Module container (horizontal scroll)
    const modulesEl = document.createElement('div');
    modulesEl.className = 'channel-modules';
    modulesEl.dataset.channelId = this.id;
    this._modulesEl = modulesEl;
    el.appendChild(modulesEl);

    this.el = el;
    return el;
  }

  addModuleEl(moduleEl) {
    if (this._modulesEl) {
      this._modulesEl.appendChild(moduleEl);
    }
  }

  removeModuleEl(moduleEl) {
    if (moduleEl.parentElement === this._modulesEl) {
      moduleEl.remove();
    }
  }

  getModuleIds() {
    if (!this._modulesEl) return [];
    return Array.from(this._modulesEl.querySelectorAll('.module')).map(el => el.id);
  }

  setSelected(selected) {
    if (this.el) this.el.classList.toggle('selected', selected);
  }

  getConfig() {
    return {
      id: this.id,
      name: this.name,
      muted: this.muted,
      solo: this.solo,
      moduleIds: this.getModuleIds()
    };
  }

  restoreConfig(config) {
    if (config.name) {
      this.name = config.name;
      if (this._nameInput) this._nameInput.value = config.name;
    }
    if (config.muted) {
      this.muted = true;
      if (this.el) this.el.classList.add('muted');
    }
    if (config.solo) {
      this.solo = true;
    }
  }
}

export class MainChannel {
  constructor() {
    this.id = 'main-channel';
    this.name = 'Main';
    this.el = null;
    this._globalEffectsEl = null;
    this.onGlobalEffectChange = null;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'channel main-channel';
    el.id = this.id;

    // Header
    const header = document.createElement('div');
    header.className = 'channel-header main-header';

    const label = document.createElement('div');
    label.className = 'channel-name main-label';
    label.textContent = 'MAIN';
    header.appendChild(label);

    const hint = document.createElement('div');
    hint.className = 'channel-hint';
    hint.textContent = 'stack()';
    header.appendChild(hint);

    el.appendChild(header);

    // Global effects area
    const globalEl = document.createElement('div');
    globalEl.className = 'channel-modules main-effects';
    globalEl.dataset.channelId = this.id;

    const placeholder = document.createElement('div');
    placeholder.className = 'main-placeholder';
    placeholder.textContent = 'Drop global effects here';
    globalEl.appendChild(placeholder);

    this._globalEffectsEl = globalEl;
    el.appendChild(globalEl);

    this.el = el;
    return el;
  }

  addModuleEl(moduleEl) {
    if (this._globalEffectsEl) {
      // Remove placeholder if present
      const ph = this._globalEffectsEl.querySelector('.main-placeholder');
      if (ph) ph.remove();
      this._globalEffectsEl.appendChild(moduleEl);
    }
  }

  removeModuleEl(moduleEl) {
    if (moduleEl.parentElement === this._globalEffectsEl) {
      moduleEl.remove();
      // Restore placeholder if empty
      if (this._globalEffectsEl.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'main-placeholder';
        placeholder.textContent = 'Drop global effects here';
        this._globalEffectsEl.appendChild(placeholder);
      }
    }
  }

  getModuleIds() {
    if (!this._globalEffectsEl) return [];
    return Array.from(this._globalEffectsEl.querySelectorAll('.module')).map(el => el.id);
  }

  getConfig() {
    return {
      globalEffectModuleIds: this.getModuleIds()
    };
  }
}
