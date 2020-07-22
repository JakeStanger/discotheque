import { Logger } from '../utils/Logger';
import Module from '../utils/Module';
import kleur from 'kleur';
import IGuild from '../database/schema/IGuild';

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

  public async getEnabledModules(guild: IGuild): Promise<Module[]> {
    const disabledModules = guild.modules
      .filter(m => m.disabled)
      .map(m => m.name);

    return Object.values(this.modules).filter(
      module => !disabledModules.includes(module.getName())
    );
  }

  public registerModule(module: new (...args: any[]) => any) {
    ModuleRegistry.log(`Registering module ${kleur.blue(module.name)}`);
    this.modules[module.name] = new module();
  }
}

export default ModuleRegistry;
