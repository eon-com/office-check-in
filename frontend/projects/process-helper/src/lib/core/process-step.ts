// elementary process step
import {ProcessStepId} from './process-base';
import {StepControl} from './step-control';

export abstract class ProcessStep<C> {
    constructor(public id: ProcessStepId, public target?: keyof C) {
    }

    public abstract activate(ctx: C, sc: StepControl<C>): void;

    public abstract deactivate(ctx: C): void;
}
