import { Logger } from '../utils/Logger';
import Module from '../utils/Module';
import * as kleur from 'kleur';

class ModuleRegistry extends Logger {
  private static instance: ModuleRegistry;

  private readonly modules: Record<string, Module> = {};

  private constructor() {
    super();
    ModuleRegistry.instance = this;
  }

  public static get() {
    return ModuleRegistry.instance || new ModuleRegistry();
  }

  public getModule(module: typeof Module) {
    return this.modules[module.name];
  }

  public getModules(): Module[] {
    return Object.values(this.modules);
  }

  public registerModule(module: new (...args: any[]) => any) {
    ModuleRegistry.log(`Registering module ${kleur.blue(module.name)}`);
    this.modules[module.name] = new module();
  }
}

export default ModuleRegistry;
