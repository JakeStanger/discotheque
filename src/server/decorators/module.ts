import ModuleRegistry from '../registries/ModuleRegistry';

function module(constructor: new (...args: any[]) => any) {
  ModuleRegistry.get().registerModule(constructor);
  return constructor;
}

export default module;
