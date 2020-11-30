// calback activity step
import {ProcessStepId} from '../core/process-base';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export class DoStep<C = void> extends ProcessStep<C> {
  constructor(public id: ProcessStepId, public doCb: (ctx?: C) => void) {
    super(id);
  }

  activate(ctx: C, sc: StepControl<C>): void {
    try {
      this.doCb?.(ctx);
      sc.next();
    } catch (error) {
      sc.trap(error);
    }
  }

  deactivate(ctx: C): void {
  }
}
