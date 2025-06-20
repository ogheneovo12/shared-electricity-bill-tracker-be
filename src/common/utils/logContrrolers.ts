import { DynamicModule, Type } from '@nestjs/common';

export function logControllersRecursively(
  modules: (DynamicModule | Type<any>)[],
  depth = 0,
) {
  const seen = new Set<any>();

  function resolveModule(mod: DynamicModule | Type<any>, level: number) {
    if (seen.has(mod)) return;
    seen.add(mod);

    const indent = '  '.repeat(level);
    const modName =
      typeof mod === 'function'
        ? mod.name
        : mod.module?.name || 'UnknownModule';

    // Get controllers
    let controllers: any[] = [];

    if (typeof mod === 'function') {
      controllers = Reflect.getMetadata('controllers', mod) || [];
    } else if ('controllers' in mod) {
      controllers = mod.controllers || [];
    }

    console.log(`${indent}- ${modName}: ${controllers.length} controller(s)`);
    controllers.forEach((ctrl) => {
      console.log(`${indent}  • ${ctrl.name}`);
    });

    // Get imports and recurse
    let imports: any[] = [];

    if (typeof mod === 'function') {
      imports = Reflect.getMetadata('imports', mod) || [];
    } else if ('imports' in mod) {
      imports = mod.imports || [];
    }

    imports.forEach((imp) => {
      if (typeof imp === 'function') {
        resolveModule(imp, level + 1);
      } else if (imp?.forwardRef) {
        resolveModule(imp.forwardRef(), level + 1);
      } else if (imp?.module) {
        resolveModule(imp, level + 1);
      }
    });
  }

  modules.forEach((mod) => resolveModule(mod, depth));
}
