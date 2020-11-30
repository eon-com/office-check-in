import {BehaviorSubject, Observable} from 'rxjs';
import {ProcessVarDescriptor} from './process-var';
import {ServiceError, ServiceErrorCode} from './service-error';
import {ProcessStep} from './process-step';
import {StepControlProxy} from './step-control-proxy';
import {ProcessState} from './process-state';


export class ProcessRunner<C> {

  public state$: Observable<ProcessState>;
  public stateSnapshot: ProcessState;

  private steps: ProcessStep<C>[];
  private activeStepIndex: number;
  private activeStep: ProcessStep<C>;
  private context: C;
  private stateSubject: BehaviorSubject<ProcessState>;
  private varUpdateAt: Map<string, number>;

  constructor(steps: ProcessStep<C>[], private serviceRegistry: <T>(sym) => T) {
    this.activeStepIndex = -1;
    this.steps = steps;
    this.stateSubject = new BehaviorSubject<ProcessState>(ProcessState.IDLE);
    this.state$ = this.stateSubject.asObservable();
  }

  public run(initialContext: C, processVars: ProcessVarDescriptor[], owner: any): ProcessRunner<C> {
    this.varUpdateAt = new Map();
    this.stateSubject.next(ProcessState.PENDING);
    this.runStep(0, initialContext || {} as C, processVars ?? [], owner);
    return this;
  }

  private runStep(index: number, ctx: C, pv: ProcessVarDescriptor[], owner: any): void {
    if (index >= this.steps.length) {
      this.flushVarUpdates(index - 1, ctx, pv, owner);
      // console.log('ProcessRunner: process execution finished');
      // console.log('final context', ctx);
      this.processFinished();
      return;
    }

    if (index !== this.activeStepIndex + 1 && typeof index === 'number') {
      // console.log('ProcessRunner: warning: non-sequential step exection. is this the intent?', index, this.activeStep);
      this.flushVarUpdates(index - 1, ctx, pv, owner);
    }

    this.activeStep = this.steps[index];
    this.activeStepIndex = index;
    try {
      this.activeStep.activate(ctx, new StepControlProxy<C>(
        () => this.runStep(index + 1, ctx, pv, owner),
        (key, value) => this.updateVar(index, ctx, key, value, pv),
        (error) => this.processFailed(error, index),
        (sym) => this.serviceRegistry(sym),
        (steps) => this.childRunner(steps, pv, owner, ctx),
        () => this.stop()
      ));
    } catch (error) {
      this.processFailed(error, index);
    }
  }

  public stop(): void {
    // we need to deactivate any step
    for (const step of this.steps) {
      step.deactivate(this.context);
    }
    this.activeStep = null;
    this.stateSnapshot = ProcessState.IDLE;
    this.stateSubject.next(this.stateSnapshot);
  }

  private processFinished() {
    this.stateSnapshot = ProcessState.SUCCESS;
    this.stateSubject.next(this.stateSnapshot);
  }

  private processFailed(error: any, index: number) {
    // error at step x
    // => deactivate steps x .. n
    // => this allows steps 1 .. x-1 to reactivate the process automatically
    for (let i = index; i < this.steps.length; i++) {
      this.steps[i].deactivate(this.context);
    }

    // console.error(error);
    if (error instanceof ServiceError) {
      switch (error.errorCode) {
        case ServiceErrorCode.NOT_AUTHENTICATED:
        case ServiceErrorCode.NOT_AUTHORIZED:
          this.stateSnapshot = ProcessState.NOT_AUTHORIZED;
          break;

        case ServiceErrorCode.NOT_FOUND:
          this.stateSnapshot = ProcessState.NOT_FOUND;
          break;

        case ServiceErrorCode.NOT_POSSIBLE:
        default:
          this.stateSnapshot = ProcessState.ERROR;
          break;
      }
    } else {
      this.stateSubject.next(ProcessState.ERROR);
    }

    this.stateSubject.next(this.stateSnapshot);
  }

  private updateVar(step: number, ctx: C, key: string | keyof C, value: any, pv: ProcessVarDescriptor[]): void {
    const keyStr = key as string;
    ctx[keyStr] = value;
    // look through
    const varDesc = pv.find(x => x.contextName === keyStr);
    if (varDesc) {
      // reconsider if storing the step boldly is enough for more complex processes
      this.varUpdateAt.set(keyStr, step);
    }
  }

  private flushVarUpdates(step: number, ctx: C, pv: ProcessVarDescriptor[], owner: any): void {
    // console.log('flush var updates', step, pv);
    for (const varDesc of pv) {
      const key = varDesc.contextName;
      const targetKey = varDesc.targetName;
      if (this.varUpdateAt.has(key)) {
        const updateIndex = this.varUpdateAt.get(key);
        if (updateIndex <= step) {
          owner[targetKey] = ctx[key];
        } else {
          // process rewind => null update strategy
          owner[targetKey] = null;
        }
      } else {
        // var not updated during this run
        // console.log(`no update for ${key}@${step}`);
      }
    }
  }

  private childRunner(steps: ProcessStep<C>[], pv: ProcessVarDescriptor[], owner: any, context: C): Observable<ProcessState> {
    return new Observable<ProcessState>(subscriber => {
      const pr = new ProcessRunner(steps, this.serviceRegistry);
      const sub = pr.state$.subscribe(
        next => {
          // console.log('state update from child process', next);
          subscriber.next(next);
          if (next === ProcessState.SUCCESS) {
            // subscriber.complete();
          }
        },
        error => {
          console.log('error from child process', error);
          subscriber.error(error);
        }
      );

      // console.log('run sub branch');
      pr.run(context, pv, owner);

      return () => {
        pr.stop();
        sub.unsubscribe();
      };
    });
  }
}
