// Rack — manages channels and modules

import { Channel, MainChannel } from './channel.js';

export class Rack {
  constructor(containerEl) {
    this.container = containerEl;
    this.modules = new Map(); // id -> Module instance
    this.channels = new Map(); // id -> Channel instance
    this.mainChannel = null;
    this.selectedChannelId = null;
    this.onModuleAdded = null;
    this.onModuleRemoved = null;
    this.onChannelChange = null;

    this._channelsEl = null;
    this._mainChannelEl = null;

    this._initLayout();
  }

  _initLayout() {
    // Create channels container
    this._channelsEl = document.createElement('div');
    this._channelsEl.id = 'channels';
    this.container.appendChild(this._channelsEl);

    // Create main channel
    this.mainChannel = new MainChannel();
    const mainEl = this.mainChannel.render();
    this.container.appendChild(mainEl);
    this._mainChannelEl = mainEl;

    // Add a default first channel
    this.addChannel('track1');
  }

  addChannel(name) {
    const channel = new Channel(name);
    const el = channel.render();

    channel.onRemove = (ch) => this.removeChannel(ch.id);
    channel.onNameChange = () => {
      if (this.onChannelChange) this.onChannelChange();
    };
    channel.onMuteToggle = () => {
      if (this.onChannelChange) this.onChannelChange();
    };
    channel.onSoloToggle = () => {
      this._updateSoloStates();
      if (this.onChannelChange) this.onChannelChange();
    };

    // Click to select
    el.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.module') && !e.target.closest('button') && !e.target.closest('input')) {
        this.selectChannel(channel.id);
      }
    });

    this._channelsEl.appendChild(el);
    this.channels.set(channel.id, channel);

    // Auto-select new channel
    this.selectChannel(channel.id);

    if (this.onChannelChange) this.onChannelChange();
    return channel;
  }

  removeChannel(id) {
    const channel = this.channels.get(id);
    if (!channel) return;

    // Remove all modules in this channel
    const moduleIds = channel.getModuleIds();
    for (const modId of moduleIds) {
      this.removeModule(modId);
    }

    channel.el.remove();
    this.channels.delete(id);

    // Select another channel if this was selected
    if (this.selectedChannelId === id) {
      const remaining = Array.from(this.channels.keys());
      this.selectChannel(remaining.length > 0 ? remaining[0] : null);
    }

    if (this.onChannelChange) this.onChannelChange();
  }

  selectChannel(id) {
    // Deselect all
    for (const ch of this.channels.values()) {
      ch.setSelected(false);
    }
    this.selectedChannelId = id;
    const ch = this.channels.get(id);
    if (ch) ch.setSelected(true);
  }

  getSelectedChannel() {
    return this.channels.get(this.selectedChannelId) || null;
  }

  addModule(module, channelId = null) {
    module.onRemove = (mod) => this.removeModule(mod.id);
    const el = module.render();

    // Determine target channel
    const targetId = channelId || this.selectedChannelId;
    let target = this.channels.get(targetId);

    if (!target) {
      // Fallback: add to first channel or create one
      const first = Array.from(this.channels.values())[0];
      if (first) {
        target = first;
      } else {
        target = this.addChannel('track1');
      }
    }

    target.addModuleEl(el);
    this.modules.set(module.id, module);
    if (this.onModuleAdded) this.onModuleAdded(module);
    return module;
  }

  addModuleToMain(module) {
    module.onRemove = (mod) => this.removeModule(mod.id);
    const el = module.render();
    this.mainChannel.addModuleEl(el);
    this.modules.set(module.id, module);
    if (this.onModuleAdded) this.onModuleAdded(module);
    return module;
  }

  removeModule(id) {
    const module = this.modules.get(id);
    if (!module) return;
    if (this.onModuleRemoved) this.onModuleRemoved(module);
    module.el.remove();
    this.modules.delete(id);

    // Restore main channel placeholder if needed
    if (this.mainChannel.getModuleIds().length === 0 &&
        this.mainChannel._globalEffectsEl &&
        this.mainChannel._globalEffectsEl.children.length === 0) {
      const ph = document.createElement('div');
      ph.className = 'main-placeholder';
      ph.textContent = 'Drop global effects here';
      this.mainChannel._globalEffectsEl.appendChild(ph);
    }
  }

  getModule(id) {
    return this.modules.get(id);
  }

  getAllModules() {
    return Array.from(this.modules.values());
  }

  // Get channels in order (top to bottom)
  getChannels() {
    return Array.from(this.channels.values());
  }

  // Get module IDs for a specific channel, in left-to-right DOM order
  getChannelModuleIds(channelId) {
    const ch = this.channels.get(channelId);
    return ch ? ch.getModuleIds() : [];
  }

  // Get the channel a module belongs to
  getModuleChannel(moduleId) {
    for (const ch of this.channels.values()) {
      if (ch.getModuleIds().includes(moduleId)) return ch;
    }
    // Check main channel
    if (this.mainChannel.getModuleIds().includes(moduleId)) return this.mainChannel;
    return null;
  }

  _updateSoloStates() {
    const anySolo = Array.from(this.channels.values()).some(ch => ch.solo);
    for (const ch of this.channels.values()) {
      if (anySolo) {
        // When solo is active, mute non-solo channels visually
        ch.el.classList.toggle('solo-muted', !ch.solo);
      } else {
        ch.el.classList.remove('solo-muted');
      }
    }
  }

  clear() {
    // Remove all modules
    for (const id of [...this.modules.keys()]) {
      const module = this.modules.get(id);
      if (this.onModuleRemoved) this.onModuleRemoved(module);
      module.el.remove();
      this.modules.delete(id);
    }
    // Remove all channels
    for (const ch of this.channels.values()) {
      ch.el.remove();
    }
    this.channels.clear();
    this.selectedChannelId = null;

    // Clear main channel effects
    if (this.mainChannel._globalEffectsEl) {
      this.mainChannel._globalEffectsEl.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'main-placeholder';
      ph.textContent = 'Drop global effects here';
      this.mainChannel._globalEffectsEl.appendChild(ph);
    }

    // Add default channel
    this.addChannel('track1');
  }

  // Serialization
  getProjectState() {
    const channels = this.getChannels().map(ch => ch.getConfig());
    const mainChannel = this.mainChannel.getConfig();
    return { channels, mainChannel };
  }
}
