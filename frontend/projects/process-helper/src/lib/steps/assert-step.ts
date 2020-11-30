import {ProcessStepId} from '../core/process-base';
import {PredicateArg} from './if-step';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export class AssertStep<C = void> extends ProcessStep<C> {
  constructor(public id: ProcessStepId, private predicate: PredicateArg<C>, private onFalse?: (ctx: C) => void) {
    super(id);
  }

  activate(ctx: C, sc: StepControl<C>): void {
    if (this.predicate(ctx)) {
      sc.next();
    } else {
      if (this.onFalse) {
        this.onFalse(ctx);
      }
      sc.stop();
    }
  }

  deactivate(ctx: C): void {
  }
}
