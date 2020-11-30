import {Observable, Subscription} from 'rxjs';
import {ProcessStepId} from '../core/process-base';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export type ObservableArg<T, C = void> = Observable<T> | ((ctx: C) => Observable<T>);

// stream observation activity step
export class ObservableStep<T, C = void> extends ProcessStep<C> {
  private sub: Subscription;

  constructor(public id: ProcessStepId, public target: keyof C, public obs$: ObservableArg<T, C>) {
    super(id, target);
  }

  public activate(ctx: C, sc: StepControl<C>): void {
    let obs$: Observable<T>;
    if (typeof this.obs$ === 'function') {
      obs$ = this.obs$(ctx);
    } else {
      obs$ = this.obs$;
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = obs$.subscribe(next => {
      if (this.target) {
        sc.update(this.target, next);
      }
      sc.next();
    }, error => {
      sc.trap(error);
    }, () => {
      if (this.sub && !this.sub.closed) {
        this.sub.unsubscribe();
      }
    });
  }

  public deactivate(ctx: C): void {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
  }
}
