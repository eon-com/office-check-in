import {ProcessStepId} from '../core/process-base';
import {combineLatest, Subscription} from 'rxjs';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';
import {ProcessState} from '../core/process-state';

export class ForkStep<C> extends ProcessStep<C> {

  public branches: Array<ProcessStep<C>[]>;

  private subscriptions: Subscription[];
  private sub: Subscription;

  constructor(public id: ProcessStepId) {
    super(id);
    this.branches = [];
    this.subscriptions = [];
  }

  public activate(ctx: C, sc: StepControl<C>): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach((s) => {
        s.unsubscribe();
      });
      this.subscriptions = [];
    }

    if (this.sub) {
      this.sub.unsubscribe();
    }

    const obs$ = [];
    this.branches.forEach((b, index) => {
      const subbranch$ = sc.run(b);
      obs$.push(subbranch$);
    });

    this.sub = combineLatest(obs$).subscribe(
      next => {
        // console.log('ForkStep: result from all subbranches', next);
        const allCompleted = next.findIndex(s => s !== ProcessState.SUCCESS);
        if (allCompleted === -1) {
          sc.next();
        }
      }, error => {
        // console.log('ForkStep: error in one subbranch', error);
        sc.trap(error);
      }, () => {
        // console.log('ForkStep: forkJoin completed');
      }
    );
  }

  public deactivate(): void {
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public addBranch(steps: ProcessStep<C>[]): void {
    this.branches.push(steps);
  }
}
