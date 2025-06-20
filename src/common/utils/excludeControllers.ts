import {
  DynamicModule,
  Type,
  ForwardReference,
  forwardRef,
} from '@nestjs/common';

const excludedModuleCache = new WeakMap<Type<any>, Type<any>>();

function createExcludedModule(module: Type<any>): Type<any> {
  if (excludedModuleCache.has(module)) {
    return excludedModuleCache.get(module)!;
  }

  // Create a subclass to avoid modifying the original module
  const ExcludedModule = class extends module {};

  // Copy existing metadata from the original module
  const metadataKeys = Reflect.getMetadataKeys(module);
  metadataKeys.forEach((key) => {
    const value = Reflect.getMetadata(key, module);
    Reflect.defineMetadata(key, value, ExcludedModule);
  });

  // Override controllers to be empty
  Reflect.defineMetadata('controllers', [], ExcludedModule);

  // Process imports recursively to replace with excluded modules
  const originalImports = Reflect.getMetadata('imports', ExcludedModule) || [];
  const processedImports = originalImports.map((importItem) => {
    if (typeof importItem === 'function') {
      return createExcludedModule(importItem);
    } else if ((importItem as ForwardReference).forwardRef) {
      const originalRef = (importItem as ForwardReference).forwardRef();
      const excludedRef = createExcludedModule(originalRef);
      return forwardRef(() => excludedRef);
    } else if ((importItem as DynamicModule).module) {
      const dynamicModule = importItem as DynamicModule;
      return {
        ...dynamicModule,
        module: createExcludedModule(dynamicModule.module),
      };
    }
    return importItem;
  });

  Reflect.defineMetadata('imports', processedImports, ExcludedModule);

  excludedModuleCache.set(module, ExcludedModule);
  return ExcludedModule;
}

export function excludeControllers(modules: Type<any>[]): DynamicModule[] {
  return modules.map((module) => {
    const ExcludedModule = createExcludedModule(module);
    return {
      module: ExcludedModule,
      imports: Reflect.getMetadata('imports', ExcludedModule) || [],
      providers: Reflect.getMetadata('providers', ExcludedModule) || [],
      exports: Reflect.getMetadata('exports', ExcludedModule) || [],
      controllers: [], // Explicit exclusion
    };
  });
}
