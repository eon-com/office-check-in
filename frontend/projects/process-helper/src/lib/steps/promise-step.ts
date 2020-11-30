import {ProcessStepId} from '../core/process-base';
import {from, Observable, of, Subscription} from 'rxjs';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export type PromiseArg<T, C = void> = Promise<T> | ((ctx: C) => Promise<T>);


// promise activity step
export class PromiseStep<T, C = void> extends ProcessStep<C> {

  private sub: Subscription;
  private hasSnapshot: boolean;
  private snapshot: T;

  constructor(public id: ProcessStepId, public target: keyof C, public p: PromiseArg<T, C>) {
    super(id);
    this.hasSnapshot = false;
  }

  public activate(ctx: C, sc: StepControl<C>): void {
    let obs$: Observable<T>;
    if (typeof this.p === 'function') {
      const prom = this.p(ctx);
      obs$ = from(prom);
    } else {
      obs$ = this.hasSnapshot ? of(this.snapshot) : from(this.p);
    }
    this.sub = obs$.subscribe(next => {
      if (this.target) {
        sc.update(this.target, next);
      }
      sc.next();
    }, error => {
      sc.trap(error);
    });
  }

  public deactivate(ctx: C) {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
