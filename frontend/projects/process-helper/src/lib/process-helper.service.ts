import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import 'reflect-metadata';
import {PROCESS_VARS} from './core/process-var';
import {ProcessRunner} from './core/process-runner';
import {ProcessBuilderImpl} from './process-builder-impl';
import {ProcessStep} from './core/process-step';
import {ProcessState} from './core/process-state';
import {RunningProcessState} from './core/running-process.state';


interface ProcessDescriptor<C = void> {
  name: string;
  pr: ProcessRunner<C>;
  sub: Subscription;
  untilSub: Subscription;
  errorSub?: Subscription;
}

/*
helper interface for providing dependencies to the process helper dynamically
 */
export interface ProcessHelperDependencyDescriptor {
  sym: symbol;

  dep(): any;
}

export const ProcessHelperDependency = new InjectionToken<ProcessHelperDependencyDescriptor>('ProcessHelperDependency');

@Injectable({
  providedIn: 'root'
})
export class ProcessHelperService {


  public running$: Observable<RunningProcessState>;

  private runState: ReplaySubject<RunningProcessState>;
  private processInstances: Map<string, ProcessDescriptor>;
  private stateSnapshot: RunningProcessState;
  private serviceMap: Map<symbol, any>;

  constructor(
    @Optional() @Inject(ProcessHelperDependency) private processHelperDependencies: ProcessHelperDependencyDescriptor[]
  ) {
    this.runState = new ReplaySubject<RunningProcessState>();
    this.running$ = this.runState.asObservable();
    this.processInstances = new Map();
    this.stateSnapshot = {};
    this.serviceMap = new Map();

    // warm up service map (can be modified later on anyway)
    if (this.processHelperDependencies && this.processHelperDependencies instanceof Array) {
      // console.log('PH: got a list of dependency providers', this.processHelperDependencies);
      this.processHelperDependencies.forEach((depDesc) => {
        this.serviceMap.set(depDesc.sym, depDesc.dep());
      });
    } else if (this.processHelperDependencies && !(this.processHelperDependencies instanceof Array)) {
      console.warn('ProcessHelper: ProcessHelperDependency should provided as array (use multi:true)');
      const depDesc = this.processHelperDependencies as ProcessHelperDependencyDescriptor;
      this.serviceMap.set(depDesc.sym, depDesc.dep());
    }
  }

  public builder<C = void>(): ProcessBuilderImpl<C> {
    return new ProcessBuilderImpl<C>(this);
  }

  public run(name: string, process: ProcessStep<any>[], until$: Subject<void>, owner: any, onError?: any) {
    const pv = Reflect.getMetadata(PROCESS_VARS, owner) ?? [];

    this.stopProcess(name);
    const pr = new ProcessRunner<any>(
      process,
      (sym) => this.getProcessServiceRegistry(sym)
    );
    const sub = pr.state$.subscribe(next => {
      this.updateProcessState(name, next);
    });
    const untilSub = until$.subscribe(next => {
      this.stop(name);
      this.updateProcessState(name, undefined);
    });
    const pd: ProcessDescriptor = {
      name,
      pr,
      sub,
      untilSub
    };
    this.processInstances.set(name, pd);

    if (onError) {
      pd.errorSub = pr.state$.subscribe(next => {
        if (next === ProcessState.ERROR || next === ProcessState.NOT_FOUND || next === ProcessState.NOT_AUTHORIZED) {
          onError();
        }
      });
    }

    pr.run({}, pv, owner);
  }

  public stop(name: string) {
    this.stopProcess(name);
  }

  public stopAll() {
    const processNames = Array.from(this.processInstances.keys());
    processNames.forEach(pname => {
      this.stop(pname);
    });
  }

  public registerProvider<T>(sym: symbol, provider: T) {
    this.serviceMap.set(sym, provider);
  }

  private stopProcess(name: string): void {
    if (this.processInstances.has(name)) {
      const pd2 = this.processInstances.get(name);
      pd2.pr.stop();
      pd2.sub?.unsubscribe();
      pd2.untilSub?.unsubscribe();
      pd2.errorSub?.unsubscribe();
      this.processInstances.delete(name);
    }
  }

  private updateProcessState(name: string, state: ProcessState): void {
    if (state === undefined) {
      const t = {...this.stateSnapshot};
      delete t[name];
      this.runState.next(t);
    } else {
      const t = {
        ...this.stateSnapshot,
        [name]: state
      };
      this.runState.next(t);
    }
  }

  private getProcessServiceRegistry(sym): any {
    // og('getProcessService called for', sym, this.serviceMap);
    return this.serviceMap.get(sym);
  }
}
