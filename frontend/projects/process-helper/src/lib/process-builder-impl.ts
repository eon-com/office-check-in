// concrete builder implementation
import {ProcessStepId} from './core/process-base';
import {ObservableArg, ObservableStep} from './steps/observable-step';
import {DeferStep} from './steps/defer-step';
import {DoStep} from './steps/do-step';
import {PromiseArg, PromiseStep} from './steps/promise-step';
import {DialogStep, MyDialogCb} from './steps/dialog-step';
import {ForkStep} from './steps/fork-step';
import {IfStep, PredicateArg} from './steps/if-step';
import {AssertStep} from './steps/assert-step';
import {ProcessBuilder} from './core/process-builder';
import {Subject} from 'rxjs';
import {ProcessHelperService} from './process-helper.service';
import {ProcessStep} from './core/process-step';

export class ProcessBuilderImpl<C = void> implements ProcessBuilder<C> {

  private static nextProcessId = 1;

  public steps: ProcessStep<C>[];

  private processId: number;
  private nextStepId: number;

  constructor(private processHelperService: ProcessHelperService) {
    this.steps = [];
    this.processId = ProcessBuilderImpl.nextProcessId++;
    this.nextStepId = 1;
  }

  public connect<T>(obs$: ObservableArg<T, C>, target?: keyof C): ProcessBuilderImpl<C> {
    this.steps.push(new ObservableStep(
      this.createStepId(),
      target,
      obs$
    ));
    return this;
  }

  public defer(timeInMs?: number): ProcessBuilderImpl<C> {
    this.steps.push(new DeferStep<C>(
      this.createStepId(),
      timeInMs
    ));
    return this;
  }

  public do(cb: (ctx?: C) => void): ProcessBuilderImpl<C> {
    this.steps.push(new DoStep(
      this.createStepId(),
      cb
    ));
    return this;
  }

  public reckon<T>(prom: PromiseArg<T, C>, target?: keyof C): ProcessBuilderImpl<C> {
    this.steps.push(new PromiseStep<T, C>(
      this.createStepId(),
      target,
      prom,
    ));
    return this;
  }

  /*tslint:disable max-line-length */
  public dialog<T>(cb: MyDialogCb<C>, target?: keyof C): ProcessBuilderImpl<C>;
  public dialog<T>(type: string, title: string, message: string, buttons: string[] | { raised: boolean, text: string }[], customContent: any, icon?: string, target?: keyof C): ProcessBuilderImpl<C>;
  public dialog<T>(cbOrType, targetOrTitle?, message?, buttons?, customContent?, icon?, target?): ProcessBuilderImpl<C> {
    // console.log('dialogStep', cbOrType, targetOrTitle);
    let cbFunc: MyDialogCb<C>;
    let tgt: string;
    if (typeof cbOrType === 'function') {
      cbFunc = cbOrType as MyDialogCb<C>;
      tgt = targetOrTitle as string;
    } else if (typeof cbOrType === 'string') {
      cbFunc = (db, ctx) => {
        db.type(cbOrType).title(targetOrTitle).message(message);
        if (buttons) {
          buttons.forEach((btn, index) => {
            if (typeof btn === 'string') {
              db.button(btn);
            } else if (btn.raised) {
              db.raisedButton(btn.text);
            } else {
              db.button(btn.text);
            }
          });
        }
        if (customContent) {
          db.content(customContent);
        }
        if (icon) {
          db.icon(icon);
        }
      };
      tgt = target;
    }

    this.steps.push(new DialogStep<T, C>(
      this.createStepId(),
      cbFunc,
      target
    ));

    return this;
  }

  /*tslint:enable max-line-length */

  // fork mit subbuilder als Parameter ist innovativer
  public fork(branch1: (pb: ProcessBuilderImpl<C>) => void,
              branch2: (pb: ProcessBuilderImpl<C>) => void,
              ...otherBranchBuilders: ((pb: ProcessBuilderImpl<C>) => void)[]): ProcessBuilderImpl<C> {
    const allBranches = [branch1, branch2, ...otherBranchBuilders];
    const forkStep = new ForkStep<C>(this.createStepId());
    this.steps.push(forkStep);
    allBranches.forEach((bb) => {
      const pb = new ProcessBuilderImpl<C>(this.processHelperService);
      bb(pb);
      if (pb.steps.length > 0) {
        forkStep.addBranch(pb.steps);
      }
    });
    return this;
  }

  public if(predicate: PredicateArg<C>, branch: (pb: ProcessBuilderImpl<C>) => void): ProcessBuilderImpl<C> {
    const pb = new ProcessBuilderImpl<C>(this.processHelperService);
    branch(pb);
    this.steps.push(new IfStep(
      this.createStepId(),
      predicate,
      pb.steps
    ));
    return this;
  }

  public assert(predicate: PredicateArg<C>, onFalse?: (ctx: C) => void): ProcessBuilderImpl<C> {
    this.steps.push(new AssertStep(
      this.createStepId(),
      predicate,
      onFalse
    ));
    return this;
  }

  run(name: string, until$: Subject<void>, owner: any, onError?: any) {
    this.processHelperService.run(name, this.steps, until$, owner, onError);
  }

  public name(n: string): ProcessBuilderImpl<C> {
    return this;
  }


  public endGroup(): ProcessBuilderImpl<C> {
    return this;
  }

  public group(n: string): ProcessBuilderImpl<C> {
    return this;
  }

  private createStepId(): ProcessStepId {
    return `${this.processId}.${this.nextStepId++}`;
  }
}
