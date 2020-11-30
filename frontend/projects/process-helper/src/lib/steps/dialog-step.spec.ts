import {DialogStep, DialogStepErrorCode, MyDialogCb} from './dialog-step';
import {StepControl} from '../core/step-control';

describe('DialogStep', () => {

  it('should create a dialog', () => {
    const buildDialog: MyDialogCb = (db, ctx) => {
    };
    const context = {};
    const s = new DialogStep<any, any>('0', buildDialog, 'dialogResult');
    expect(s).toBeTruthy();
  });

  it('should fail without dialog provider', () => {
    let trapCalled = false;
    let error;
    const buildDialog: MyDialogCb = (db, ctx) => {
    };
    const s = new DialogStep<any, any>('0', buildDialog, 'dialogResult');
    s.activate(undefined, {
      service(sym) {
        return null;
      }, trap(e) {
        trapCalled = true;
        error = e;
      }
    } as StepControl);
    expect(trapCalled).toBeTruthy();
    expect(error?.code).toBe(DialogStepErrorCode.NO_DIALOG_PROVIDER);
  });

  it('should fail wihtout valid provider', () => {
    let trapCalled = false;
    let error;
    const buildDialog: MyDialogCb = (db, ctx) => {
    };
    const s = new DialogStep<any, any>('0', buildDialog, 'dialogResult');
    s.activate(undefined, {
      service(sym) {
        return 1;
      }, trap(e) {
        trapCalled = true;
        error = e;
      }
    } as StepControl);
    expect(trapCalled).toBeTruthy();
    expect(error?.code).toBe(DialogStepErrorCode.NO_BUILDER);
  });

  it('should fail with error in builder setup', () => {
    let trapCalled = false;
    let error;
    const buildDialog: MyDialogCb = (db, ctx) => {
      throw new Error('i am a bad builder.');
    };
    const s = new DialogStep<any, any>('0', buildDialog, 'dialogResult');
    s.activate(undefined, {
      service(sym) {
        return () => ({});
      }, trap(e) {
        trapCalled = true;
        error = e;
      }
    } as StepControl);
    expect(trapCalled).toBeTruthy();
    expect(error?.code).toBe(DialogStepErrorCode.PREPARE_BUILDER_ERROR);
  });

  it('should fail with error in builder', () => {
    let trapCalled = false;
    let error;
    const buildDialog: MyDialogCb = (db, ctx) => {
    };
    const s = new DialogStep<any, any>('0', buildDialog, 'dialogResult');
    s.activate(undefined, {
      service(sym) {
        return () => ({});
      }, trap(e) {
        trapCalled = true;
        error = e;
      }
    } as StepControl);
    expect(trapCalled).toBeTruthy();
    expect(error?.code).toBe(DialogStepErrorCode.BUILDER_ERROR);
  });
});
