import 'reflect-metadata';

// constant for metadata reflection
export const PROCESS_VARS = 'process_vars';

export interface ProcessVarDescriptor {
  targetName: string;
  contextName: string;
}

export function MyProcessVar(contextName?: string): (target: any, key: string) => void {
  // tslint:disable-next-line:only-arrow-functions
  return function(target: any, propertyKey: string) {
    if (!Reflect.hasMetadata(PROCESS_VARS, target)) {
      Reflect.defineMetadata(PROCESS_VARS, [], target);
    }
    const pv = Reflect.getMetadata(PROCESS_VARS, target);
    pv.push({
      targetName: propertyKey,
      contextName: contextName ?? propertyKey
    } as ProcessVarDescriptor);
  };
}
