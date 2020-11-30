// interface defining basic process elements
import {Observable, Subject} from 'rxjs';
import {MyDialogCb} from '../steps/dialog-step';
import {PredicateArg} from '../steps/if-step';
import {ProcessBuilderImpl} from '../process-builder-impl';


export interface ProcessBuilder<C = void> {
  // wait for a promise
  reckon<T>(prom: Promise<T>, target?: keyof C): ProcessBuilder<C>;

  // observe a stream
  connect<T>(obs$: Observable<T>, target?: keyof C): ProcessBuilder<C>;

  // execute callback
  do(cb: (ctx?: C) => void): ProcessBuilder<C>;

  // defer execution (always jumps into a new execution stack, for 0ms too)
  defer(timeInMs?: number): ProcessBuilder<C>;

  // ext.v1
  // turn often used do-expressions into dedicated steps
  dialog<T>(cb: MyDialogCb<C>, target?: keyof C): ProcessBuilder<C>;

  /*tslint:disable max-line-length*/
  dialog<T>(type: string, title: string, message: string, buttons: string[], customContent: any, icon?: string, target?: keyof C): ProcessBuilder<C>;

  // ext.v2
  // branching and subprocesses
  // navigate(dest: string | string[] | (ctx?: C) => string[]): MyProcess<C>
  // branchIf(pred: string | (ctx?: C) => boolean, (pb: processBuilder) => Process): MyProcess<C>
  // endBranch(): MyProcess<C>
  /*tslint:disable max-line-length*/
  fork(branch1: (pb: ProcessBuilderImpl<C>) => void, branch2: (pb: ProcessBuilderImpl<C>) => void, ...otherBranchBuilders: ((pb: ProcessBuilderImpl<C>) => void)[]): ProcessBuilder<C>;

  // execute branch if predicate evaluates to True
  if(predicate: PredicateArg<C>, branch: (pb: ProcessBuilderImpl<C>) => void): ProcessBuilder<C>;

  /** end process if predicate evaluates to false */
  assert(predicate: PredicateArg<C>, onFalse?: (ctx: C) => void): ProcessBuilder<C>;

  /** runs the process */
  run(name: string, until$: Subject<void>, owner: any, onError?: any);

  // asyncDo(otherProcess: any, name: string);

  // ext.v3
  // allow naming of substeps
  // connect(obs$, target?, stepName?)
  // => is now visible as a running process, prefixed by process name
  // => if we use this sparse, would a builder step simplify things?
  // name last artifact (branch if no step create, last step otherwise)
  name(n: string): ProcessBuilder<C>;

  // group subsequent steps under name n (unless endGroup or end of process)
  group(n: string): ProcessBuilder<C>;
  endGroup(): ProcessBuilder<C>;
}
