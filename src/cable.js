// Cable system — SVG patch cables, connection graph, drag interaction

const CABLE_COLORS = ['#ff4081', '#00e5ff', '#ffea00', '#76ff03', '#e040fb', '#ff6e40', '#40c4ff', '#b2ff59'];
let colorIndex = 0;

export class CableManager {
  constructor(svgEl, rackContainer) {
    this.svg = svgEl;
    this.rackContainer = rackContainer;
    this.connections = []; // [{id, from: {moduleId, jackName}, to: {moduleId, jackName}, color, pathEl}]
    this.dragging = null;  // {from: {moduleId, jackName, type}, tempPath}
    this.onConnectionChange = null;
    this._connectionId = 0;

    this._setupDragListeners();
  }

  _setupDragListeners() {
    // Mouseup on any jack (input) to complete connection
    this.rackContainer.addEventListener('mousedown', (e) => {
      const jack = e.target.closest('.jack');
      if (!jack) return;

      const dir = jack.dataset.jackDir;
      const moduleId = jack.dataset.moduleId;
      const jackName = jack.dataset.jackName;
      const jackType = jack.dataset.jackType;

      if (dir === 'output') {
        // Start dragging from output
        const rect = jack.getBoundingClientRect();
        const containerRect = this.rackContainer.getBoundingClientRect();
        const startX = rect.left + rect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
        const startY = rect.top + rect.height / 2 - containerRect.top + this.rackContainer.scrollTop;

        const path = this._createPathEl(this._nextColor());
        path.style.pointerEvents = 'none'; // Don't intercept mouseup during drag
        this.svg.appendChild(path);

        this.dragging = {
          from: { moduleId, jackName, type: jackType },
          startX, startY,
          pathEl: path
        };

        this._updatePath(path, startX, startY, startX, startY);
        e.preventDefault();
      } else if (dir === 'input' && this.dragging) {
        // Complete connection
        this._completeConnection(moduleId, jackName, jackType);
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      const containerRect = this.rackContainer.getBoundingClientRect();
      const x = e.clientX - containerRect.left + this.rackContainer.scrollLeft;
      const y = e.clientY - containerRect.top + this.rackContainer.scrollTop;
      this._updatePath(this.dragging.pathEl, this.dragging.startX, this.dragging.startY, x, y);
    });

    window.addEventListener('mouseup', (e) => {
      if (!this.dragging) return;
      // Use elementsFromPoint to find the jack under cursor, regardless of SVG overlay
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const jack = elements.find(el => el.classList?.contains('jack'));
      if (jack && jack.dataset.jackDir === 'input') {
        this._completeConnection(jack.dataset.moduleId, jack.dataset.jackName, jack.dataset.jackType);
      } else {
        // Cancel drag
        this.dragging.pathEl.remove();
        this.dragging = null;
      }
    });
  }

  _completeConnection(toModuleId, toJackName, toJackType) {
    if (!this.dragging) return;

    // Prevent connecting to same module
    if (this.dragging.from.moduleId === toModuleId) {
      this.dragging.pathEl.remove();
      this.dragging = null;
      return;
    }

    // Remove existing connection to this input (one cable per input)
    this.disconnectInput(toModuleId, toJackName);

    // Get end position
    const toJack = this.rackContainer.querySelector(
      `.jack[data-module-id="${toModuleId}"][data-jack-name="${toJackName}"]`
    );
    if (!toJack) {
      this.dragging.pathEl.remove();
      this.dragging = null;
      return;
    }

    const containerRect = this.rackContainer.getBoundingClientRect();
    const rect = toJack.getBoundingClientRect();
    const endX = rect.left + rect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
    const endY = rect.top + rect.height / 2 - containerRect.top + this.rackContainer.scrollTop;

    this._updatePath(this.dragging.pathEl, this.dragging.startX, this.dragging.startY, endX, endY);

    const conn = {
      id: ++this._connectionId,
      from: { moduleId: this.dragging.from.moduleId, jackName: this.dragging.from.jackName },
      to: { moduleId: toModuleId, jackName: toJackName },
      color: this.dragging.pathEl.getAttribute('stroke'),
      pathEl: this.dragging.pathEl
    };

    // Enable drag-to-reconnect on finalized cable
    conn.pathEl.classList.add('connected');
    this._setupCableRedrag(conn);

    // Mark jacks as connected
    const fromJack = this.rackContainer.querySelector(
      `.jack[data-module-id="${conn.from.moduleId}"][data-jack-name="${conn.from.jackName}"]`
    );
    if (fromJack) fromJack.classList.add('connected');
    toJack.classList.add('connected');

    this.connections.push(conn);
    this.dragging = null;

    if (this.onConnectionChange) this.onConnectionChange();
  }

  removeConnection(id) {
    const idx = this.connections.findIndex(c => c.id === id);
    if (idx === -1) return;
    const conn = this.connections[idx];
    conn.pathEl.remove();
    this.connections.splice(idx, 1);

    // Update connected state
    this._updateJackConnectedState(conn.from.moduleId, conn.from.jackName);
    this._updateJackConnectedState(conn.to.moduleId, conn.to.jackName);

    if (this.onConnectionChange) this.onConnectionChange();
  }

  disconnectInput(moduleId, jackName) {
    const existing = this.connections.filter(c => c.to.moduleId === moduleId && c.to.jackName === jackName);
    for (const conn of existing) {
      this.removeConnection(conn.id);
    }
  }

  removeModuleConnections(moduleId) {
    const toRemove = this.connections.filter(
      c => c.from.moduleId === moduleId || c.to.moduleId === moduleId
    );
    for (const conn of toRemove) {
      this.removeConnection(conn.id);
    }
  }

  getInputConnections(moduleId) {
    return this.connections.filter(c => c.to.moduleId === moduleId);
  }

  getOutputConnections(moduleId) {
    return this.connections.filter(c => c.from.moduleId === moduleId);
  }

  addConnection(fromModuleId, fromJackName, toModuleId, toJackName) {
    const fromJack = this.rackContainer.querySelector(
      `.jack[data-module-id="${fromModuleId}"][data-jack-name="${fromJackName}"]`
    );
    const toJack = this.rackContainer.querySelector(
      `.jack[data-module-id="${toModuleId}"][data-jack-name="${toJackName}"]`
    );
    if (!fromJack || !toJack) return;

    this.disconnectInput(toModuleId, toJackName);

    const containerRect = this.rackContainer.getBoundingClientRect();
    const fromRect = fromJack.getBoundingClientRect();
    const toRect = toJack.getBoundingClientRect();
    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top + this.rackContainer.scrollTop;
    const x2 = toRect.left + toRect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
    const y2 = toRect.top + toRect.height / 2 - containerRect.top + this.rackContainer.scrollTop;

    const color = this._nextColor();
    const pathEl = this._createPathEl(color);
    this.svg.appendChild(pathEl);
    this._updatePath(pathEl, x1, y1, x2, y2);

    const conn = {
      id: ++this._connectionId,
      from: { moduleId: fromModuleId, jackName: fromJackName },
      to: { moduleId: toModuleId, jackName: toJackName },
      color, pathEl
    };

    pathEl.classList.add('connected');
    this._setupCableRedrag(conn);

    fromJack.classList.add('connected');
    toJack.classList.add('connected');
    this.connections.push(conn);

    if (this.onConnectionChange) this.onConnectionChange();
  }

  getSourceModule(moduleId, jackName) {
    const conn = this.connections.find(c => c.to.moduleId === moduleId && c.to.jackName === jackName);
    return conn ? conn.from.moduleId : null;
  }

  refreshPositions() {
    const containerRect = this.rackContainer.getBoundingClientRect();
    for (const conn of this.connections) {
      const fromJack = this.rackContainer.querySelector(
        `.jack[data-module-id="${conn.from.moduleId}"][data-jack-name="${conn.from.jackName}"]`
      );
      const toJack = this.rackContainer.querySelector(
        `.jack[data-module-id="${conn.to.moduleId}"][data-jack-name="${conn.to.jackName}"]`
      );
      if (!fromJack || !toJack) continue;

      const fromRect = fromJack.getBoundingClientRect();
      const toRect = toJack.getBoundingClientRect();
      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top + this.rackContainer.scrollTop;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top + this.rackContainer.scrollTop;
      this._updatePath(conn.pathEl, x1, y1, x2, y2);
    }
  }

  _setupCableRedrag(conn) {
    conn.pathEl.addEventListener('mousedown', (e) => {
      if (this.dragging) return;
      e.preventDefault();
      e.stopPropagation();

      // Get source jack position
      const fromJack = this.rackContainer.querySelector(
        `.jack[data-module-id="${conn.from.moduleId}"][data-jack-name="${conn.from.jackName}"]`
      );
      if (!fromJack) return;

      const containerRect = this.rackContainer.getBoundingClientRect();
      const fromRect = fromJack.getBoundingClientRect();
      const startX = fromRect.left + fromRect.width / 2 - containerRect.left + this.rackContainer.scrollLeft;
      const startY = fromRect.top + fromRect.height / 2 - containerRect.top + this.rackContainer.scrollTop;

      // Detach destination end — remove connection but keep pathEl
      const pathEl = conn.pathEl;
      const idx = this.connections.findIndex(c => c.id === conn.id);
      if (idx !== -1) this.connections.splice(idx, 1);

      // Update jack connected states for the detached end
      this._updateJackConnectedState(conn.to.moduleId, conn.to.jackName);
      this._updateJackConnectedState(conn.from.moduleId, conn.from.jackName);

      // Enter drag mode reusing the path
      pathEl.classList.remove('connected');
      pathEl.style.pointerEvents = 'none';

      this.dragging = {
        from: { moduleId: conn.from.moduleId, jackName: conn.from.jackName, type: fromJack.dataset.jackType },
        startX, startY,
        pathEl
      };

      if (this.onConnectionChange) this.onConnectionChange();
    });
  }

  _updateJackConnectedState(moduleId, jackName) {
    const jack = this.rackContainer.querySelector(
      `.jack[data-module-id="${moduleId}"][data-jack-name="${jackName}"]`
    );
    if (!jack) return;
    const hasConn = this.connections.some(
      c => (c.from.moduleId === moduleId && c.from.jackName === jackName) ||
           (c.to.moduleId === moduleId && c.to.jackName === jackName)
    );
    jack.classList.toggle('connected', hasConn);
  }

  _createPathEl(color) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    return path;
  }

  _updatePath(pathEl, x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1) * 0.5;
    const dy = Math.max(30, Math.abs(y2 - y1) * 0.3);
    // Droopy bezier curve (cables sag)
    const sagY = Math.max(y1, y2) + dy;
    const d = `M ${x1} ${y1} C ${x1 + dx} ${sagY}, ${x2 - dx} ${sagY}, ${x2} ${y2}`;
    pathEl.setAttribute('d', d);
  }

  _nextColor() {
    const color = CABLE_COLORS[colorIndex % CABLE_COLORS.length];
    colorIndex++;
    return color;
  }
}
