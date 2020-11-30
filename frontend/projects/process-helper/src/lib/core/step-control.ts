import {ProcessStep} from './process-step';
import {Observable} from 'rxjs';
import {ProcessState} from './process-state';

export interface StepControl<C = void> {
    log(msg: string, data?: any): void;

    update(key: string | keyof C, value: any): void;

    next(): void;

    trap(error?: any): void;

    service<T>(serviceSymbol): T;

    run(steps: ProcessStep<C>[] /* , pv: ProcessVarDescriptor[], owner: any */): Observable<ProcessState>;

    stop(): void;
}
