import {StepControl} from './step-control';
import {ProcessStep} from './process-step';
import {Observable} from 'rxjs';
import {ProcessState} from './process-state';

export class StepControlProxy<C> implements StepControl<C> {
    constructor(
        private nextCb: () => void,
        private updateCb: (target: string | keyof C, value: any) => void,
        private trapCb: (error) => void,
        private svcs: <S>(sym) => S,
        private runCb: (steps: ProcessStep<C>[]) => Observable<ProcessState>,
        private stopCb: () => void
    ) {
    }

    public log(msg: string, data?: any): void {
        console.log(`step log ${msg}`, data);
    }

    public next(): void {
        this.nextCb();
    }

    public trap(error?: any): void {
        this.trapCb(error);
    }

    public update(key: string | keyof C, value: any): void {
        this.updateCb(key, value);
    }

    public service<S>(sym): S {
        return this.svcs(sym);
    }

    public run(steps: ProcessStep<C>[]): Observable<ProcessState> {
        return this.runCb(steps);
    }

    public stop(): void {
        this.stopCb();
    }
}
