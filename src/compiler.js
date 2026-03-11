// Compiler — traverses module connection graph → generates Strudel pattern code
// Supports two modes:
// 1. Channel mode: compile each channel's chain left-to-right, stack in Main
// 2. Legacy mode: walk backward from terminal modules (for backward compat)

export class Compiler {
  constructor(rack, cables) {
    this.rack = rack;
    this.cables = cables;
  }

  compile() {
    // Use channel-aware compilation if rack has channels
    if (this.rack.channels && this.rack.channels.size > 0) {
      return this._compileChannels();
    }
    // Fallback: legacy terminal-based compilation
    return this._compileLegacy();
  }

  // ── Channel-Aware Compilation ──

  _compileChannels() {
    const channels = this.rack.getChannels();
    const lines = [];
    const channelNames = [];

    // Check if any channel has solo enabled
    const anySolo = channels.some(ch => ch.solo);

    for (const channel of channels) {
      // Skip muted channels (or non-solo when solo is active)
      if (channel.muted) continue;
      if (anySolo && !channel.solo) continue;

      const moduleIds = channel.getModuleIds();
      if (moduleIds.length === 0) continue;

      const code = this._compileChain(moduleIds);
      if (!code) continue;

      // Sanitize name as valid JS identifier
      const name = channel.name.replace(/[^a-zA-Z0-9_]/g, '_') || 'track';
      lines.push(`const ${name} = ${code}`);
      channelNames.push(name);
    }

    if (channelNames.length === 0) return '';

    // Build main stack
    let mainCode;
    if (channelNames.length === 1) {
      mainCode = channelNames[0];
    } else {
      mainCode = `stack(${channelNames.join(', ')})`;
    }

    // Apply global effects from main channel
    const globalIds = this.rack.mainChannel.getModuleIds();
    if (globalIds.length > 0) {
      for (const modId of globalIds) {
        const mod = this.rack.getModule(modId);
        if (mod && mod.compile) {
          const effected = mod.compile(mainCode);
          if (effected) mainCode = effected;
        }
      }
    }

    lines.push(mainCode);
    return lines.join('\n');
  }

  _compileChain(moduleIds) {
    // Compile modules left-to-right following cable connections
    // Start from the leftmost module that has no connected input (source)
    // Walk through the chain via output→input connections

    if (moduleIds.length === 0) return null;

    // Build a set for fast lookup
    const idSet = new Set(moduleIds);

    // Find source modules (no 'in' input connected, or no 'in' input at all)
    const sources = [];
    for (const id of moduleIds) {
      const mod = this.rack.getModule(id);
      if (!mod) continue;

      const mainInput = mod.inputs.find(i => i.name === 'in' || i.name === 'in1');
      if (!mainInput) {
        sources.push(id);
        continue;
      }

      const sourceId = this.cables.getSourceModule(id, mainInput.name);
      if (!sourceId || !idSet.has(sourceId)) {
        sources.push(id);
      }
    }

    if (sources.length === 0) {
      // No clear source — just try the first module
      sources.push(moduleIds[0]);
    }

    // For multi-source channels, we need to handle multi-input modules
    if (sources.length === 1) {
      return this._walkChain(sources[0], idSet, new Set());
    }

    // Multiple sources: try to find a multi-input module that collects them
    // Otherwise compile the first source chain
    return this._walkChain(sources[0], idSet, new Set());
  }

  _walkChain(startId, channelIds, visited) {
    if (visited.has(startId)) return null;
    visited.add(startId);

    const mod = this.rack.getModule(startId);
    if (!mod) return null;

    // First, resolve any inputs this module needs
    let inputCode = null;
    let modCode = null;

    // Check for multi-input module
    if (this._isMultiInput(mod)) {
      const inputNames = mod.inputs.map(i => i.name);
      const inputCodes = [];
      for (const inputName of inputNames) {
        const sourceId = this.cables.getSourceModule(mod.id, inputName);
        if (sourceId && channelIds.has(sourceId)) {
          const code = this._walkChain(sourceId, channelIds, new Set(visited));
          if (code) inputCodes.push(code);
        }
      }
      const compiled = mod.compile(inputCodes);

      // Continue chain: find what this module's output connects to within the channel
      return this._continueChain(mod, compiled, channelIds, visited);
    }

    // Check for mod input
    if (this._hasModInput(mod)) {
      const mainInputName = this._getMainInput(mod);
      if (mainInputName) {
        const sourceId = this.cables.getSourceModule(mod.id, mainInputName);
        if (sourceId && channelIds.has(sourceId)) {
          inputCode = this._walkChain(sourceId, channelIds, new Set(visited));
        }
      }
      const modInputName = this._getModInput(mod);
      if (modInputName) {
        const modSourceId = this.cables.getSourceModule(mod.id, modInputName);
        if (modSourceId) {
          const modMod = this.rack.getModule(modSourceId);
          if (modMod) {
            modCode = this._compileModule(modMod, new Set(visited));
          }
        }
      }
      const compiled = mod.compile(inputCode, modCode);
      return this._continueChain(mod, compiled, channelIds, visited);
    }

    // Single-input module
    const mainInput = this._getMainInput(mod);
    if (mainInput) {
      const sourceId = this.cables.getSourceModule(mod.id, mainInput);
      if (sourceId && channelIds.has(sourceId)) {
        inputCode = this._walkChain(sourceId, channelIds, new Set(visited));
      }
    }

    const compiled = mainInput ? mod.compile(inputCode) : mod.compile();

    // Continue chain: find the next module in channel connected to this output
    return this._continueChain(mod, compiled, channelIds, visited);
  }

  _continueChain(mod, currentCode, channelIds, visited) {
    if (!currentCode) return null;

    // Find what this module's 'out' output connects to within the channel
    const outConns = this.cables.getOutputConnections(mod.id);
    for (const conn of outConns) {
      if (channelIds.has(conn.to.moduleId) && !visited.has(conn.to.moduleId)) {
        const nextMod = this.rack.getModule(conn.to.moduleId);
        if (!nextMod) continue;

        // The next module should use currentCode as its input
        visited.add(conn.to.moduleId);

        // Check what input the connection goes to
        if (conn.to.jackName === 'in' || conn.to.jackName === 'in1') {
          // Check if next module also has a mod input
          if (this._hasModInput(nextMod)) {
            let nextModCode = null;
            const modInputName = this._getModInput(nextMod);
            if (modInputName) {
              const modSourceId = this.cables.getSourceModule(nextMod.id, modInputName);
              if (modSourceId) {
                const modSource = this.rack.getModule(modSourceId);
                if (modSource) {
                  nextModCode = this._compileModule(modSource, new Set(visited));
                }
              }
            }
            const nextCompiled = nextMod.compile(currentCode, nextModCode);
            return this._continueChain(nextMod, nextCompiled, channelIds, visited);
          }

          const nextCompiled = nextMod.compile(currentCode);
          return this._continueChain(nextMod, nextCompiled, channelIds, visited);
        }
      }
    }

    // No next module in chain — this is the end
    return currentCode;
  }

  // ── Legacy Terminal-Based Compilation ──

  _compileLegacy() {
    const terminalTypes = ['output', 'midi-out', 'osc-out', 'piano-roll', 'scope', 'spectrum', 'spiral', 'punchcard', 'wordfall', 'pitchwheel'];
    const terminals = this.rack.getAllModules().filter(
      m => terminalTypes.includes(m.type)
    );

    if (terminals.length === 0) return '';

    const patterns = [];
    for (const terminal of terminals) {
      const code = this._compileModule(terminal, new Set());
      if (code) patterns.push(code);
    }

    return patterns.join('\n');
  }

  _compileModule(module, visited) {
    if (visited.has(module.id)) return null; // prevent cycles
    visited.add(module.id);

    // Multi-input modules (stack, cat, choose, merge, slowcat, etc.)
    if (this._isMultiInput(module)) {
      return this._compileMultiInput(module, visited);
    }

    // Modules with a 'mod' (control) input and a main 'in'
    if (this._hasModInput(module)) {
      return this._compileWithMod(module, visited);
    }

    // Single-input passthrough modules (effects, time mods, etc.)
    const mainInput = this._getMainInput(module);
    if (mainInput) {
      const sourceModuleId = this.cables.getSourceModule(module.id, mainInput);
      let inputCode = null;
      if (sourceModuleId) {
        const sourceModule = this.rack.getModule(sourceModuleId);
        if (sourceModule) {
          inputCode = this._compileModule(sourceModule, visited);
        }
      }
      return module.compile(inputCode);
    }

    // Source modules (no inputs — sequence, mini, noise, keyboard, etc.)
    return module.compile();
  }

  _compileMultiInput(module, visited) {
    const inputNames = module.inputs.map(i => i.name);
    const inputCodes = [];
    for (const inputName of inputNames) {
      const sourceModuleId = this.cables.getSourceModule(module.id, inputName);
      if (sourceModuleId) {
        const sourceModule = this.rack.getModule(sourceModuleId);
        if (sourceModule) {
          // Clone visited per branch so one branch can't block another
          const branchVisited = new Set(visited);
          const code = this._compileModule(sourceModule, branchVisited);
          if (code) inputCodes.push(code);
        }
      }
    }
    visited.add(module.id);
    return module.compile(inputCodes);
  }

  _compileWithMod(module, visited) {
    // Get main audio/pattern input
    const mainInputName = this._getMainInput(module);
    let inputCode = null;
    if (mainInputName) {
      const sourceId = this.cables.getSourceModule(module.id, mainInputName);
      if (sourceId) {
        const source = this.rack.getModule(sourceId);
        if (source) inputCode = this._compileModule(source, visited);
      }
    }

    // Get mod/control input — use separate visited clone so mod doesn't conflict with main
    let modCode = null;
    const modInputName = this._getModInput(module);
    if (modInputName) {
      const modSourceId = this.cables.getSourceModule(module.id, modInputName);
      if (modSourceId) {
        const modSource = this.rack.getModule(modSourceId);
        if (modSource) {
          const modVisited = new Set(visited);
          modCode = this._compileModule(modSource, modVisited);
        }
      }
    }

    return module.compile(inputCode, modCode);
  }

  _isMultiInput(module) {
    // Check module flag first (factory-generated modules), then hardcoded list
    if (module.isMultiInput) return true;
    return ['stack', 'cat', 'choose', 'merge'].includes(module.type);
  }

  _hasModInput(module) {
    return module.inputs.some(i =>
      i.name === 'mod' || i.name === 'cutoffMod' || i.name === 'effect'
    );
  }

  _getMainInput(module) {
    // Find the primary input (not mod/control)
    const main = module.inputs.find(i =>
      i.name === 'in' || i.name === 'in1'
    );
    return main ? main.name : null;
  }

  _getModInput(module) {
    const mod = module.inputs.find(i =>
      i.name === 'mod' || i.name === 'cutoffMod' || i.name === 'effect'
    );
    return mod ? mod.name : null;
  }
}
