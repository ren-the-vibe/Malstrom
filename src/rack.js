// Rack — manages the module grid, add/remove modules

export class Rack {
  constructor(containerEl) {
    this.container = containerEl;
    this.modules = new Map(); // id -> Module instance
    this.onModuleAdded = null;
    this.onModuleRemoved = null;
  }

  addModule(module) {
    module.onRemove = (mod) => this.removeModule(mod.id);
    const el = module.render();
    this.container.appendChild(el);
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
  }

  getModule(id) {
    return this.modules.get(id);
  }

  getAllModules() {
    return Array.from(this.modules.values());
  }

  clear() {
    for (const id of [...this.modules.keys()]) {
      this.removeModule(id);
    }
  }
}
