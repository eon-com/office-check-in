import {Observable, Subscription} from 'rxjs';
import {ProcessStepId} from '../core/process-base';
import {ProcessStep} from '../core/process-step';
import {StepControl} from '../core/step-control';

export interface MyDialogBuilder<T> {
  type(t: string): MyDialogBuilder<T>;

  title(t: string): MyDialogBuilder<T>;

  message(t: string): MyDialogBuilder<T>;

  content(c: any): MyDialogBuilder<T>;

  button(t: string): MyDialogBuilder<T>;

  raisedButton(t: string): MyDialogBuilder<T>;

  icon(t: string): MyDialogBuilder<T>;

  build(): Observable<T>;
}

export type MyDialogProvider<T> = () => MyDialogBuilder<T>;

export const MyDialogProvider = Symbol('MyDialogProvider');

export type MyDialogCb<C = void> = (db: MyDialogBuilder<any>, ctx?: C) => void;

export enum DialogStepErrorCode {
  OK = 0,
  NO_DIALOG_PROVIDER,
  NO_BUILDER,
  PREPARE_BUILDER_ERROR,
  BUILDER_ERROR = 4,
  DIALOG_SUBSCRIBE_ERROR
}

export class DialogStepError {
  constructor(public code: DialogStepErrorCode) {
  }
}

export const ERROR_MISSING_DIALOG_PROVIDER = 'DialogStep: Missing dialog provider';

export class DialogStep<T, C = void> extends ProcessStep<C> {
  private dialogSub: Subscription;

  constructor(public id: ProcessStepId, public bdCb: MyDialogCb<C>, public target: keyof C) {
    super(id);
  }

  activate(ctx: C, sc: StepControl<C>) {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
    let errorCode = DialogStepErrorCode.NO_DIALOG_PROVIDER;
    const dbProvider = sc.service<MyDialogProvider<any>>(MyDialogProvider);
    if (!dbProvider) {
      sc.trap(new DialogStepError(errorCode));
      return;
    }

    let db;
    let dialog$;
    try {
      errorCode = DialogStepErrorCode.NO_BUILDER;
      db = dbProvider();
      errorCode = DialogStepErrorCode.PREPARE_BUILDER_ERROR;
      this.bdCb(db, ctx);
      errorCode = DialogStepErrorCode.BUILDER_ERROR;
      dialog$ = db.build();
      errorCode = DialogStepErrorCode.DIALOG_SUBSCRIBE_ERROR;

      if (this.target) {
        sc.update(this.target, null);
      }

      this.dialogSub = dialog$.subscribe(next => {
          sc.update(this.target, next);
        },
        error => {
          sc.trap(error);
        }, () => {
          sc.next();
        });

      errorCode = DialogStepErrorCode.OK;
    } catch (exception) {
      sc.trap(new DialogStepError(errorCode));
      return;
    }
  }

  deactivate(ctx: C) {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
