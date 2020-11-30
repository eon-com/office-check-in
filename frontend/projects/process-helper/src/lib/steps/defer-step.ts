// defer execution activity step
import {ProcessStepId} from '../core/process-base';
import {interval, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export class DeferStep<C = void> extends ProcessStep<C> {
  private sub: Subscription;

  constructor(public id: ProcessStepId, public deferTime: number) {
    super(id, undefined);
  }

  activate(ctx: C, sc: StepControl<C>): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = interval(this.deferTime).pipe(
      take(1)
    ).subscribe(next => {
      sc.next();
    });
  }

  deactivate(ctx: C): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
