import {ProcessStepId} from '../core/process-base';
import {Subscription} from 'rxjs';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';
import {ProcessState} from '../core/process-state';

export type PredicateArg<C> = (ctx?: C) => boolean;

export class IfStep<C> extends ProcessStep<C> {
  private processSub: Subscription;

  constructor(id: ProcessStepId, private predicate: PredicateArg<C>, private branch: ProcessStep<C>[]) {
    super(id, undefined);
  }

  activate(ctx: C, sc: StepControl<C>): void {
    if (this.processSub) {
      this.processSub.unsubscribe();
    }

    const isTrue = this.predicate(ctx);
    // console.log(`IfStep: predicated evaluated to ${JSON.stringify(isTrue)}`);

    if (!isTrue) {
      this.processSub = null;
      sc.next();
    } else {
      this.processSub = sc.run(this.branch).subscribe(next => {
        if (next === ProcessState.SUCCESS) {
          sc.next();
        } else if (next !== ProcessState.IDLE && next !== ProcessState.PENDING) {
          // error state => trap process
          sc.trap();
        } else {
        }
      }, error => {
        sc.trap(error);
      }, () => {
      });
    }
  }

  deactivate(ctx: C): void {
    if (this.processSub) {
      this.processSub.unsubscribe();
    }
  }
}
