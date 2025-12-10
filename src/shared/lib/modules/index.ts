import type { ModuleDefinition } from '../../../config/moduleRegistry';
import { moduleRegistry } from '../../../config/moduleRegistry';

export const listModules = (): ModuleDefinition[] => moduleRegistry;

export const getModuleById = (id: string): ModuleDefinition | undefined =>
  moduleRegistry.find((module) => module.id === id);
