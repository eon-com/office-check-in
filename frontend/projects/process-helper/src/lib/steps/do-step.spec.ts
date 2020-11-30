import {DoStep} from './do-step';
import {StepControl} from '../core/step-control';

describe('DoStep', () => {

  it('should invoke Cb on active', () => {
    let doCalled = false;
    let nextCalled = false;
    const doCb = () => {
      doCalled = true;
    };
    const s = new DoStep('0', doCb);
    s.activate(undefined, {
      next() {
        nextCalled = true;
      }
    } as StepControl);
    expect(doCalled && nextCalled).toBeTrue();
  });

  it('should invoke trap on error', () => {
    let trapCalled = false;
    let nextNotCalled = true;
    const doCb = () => {
      throw new Error('catch me');
    };
    const s = new DoStep('0', doCb);
    s.activate(undefined, {
      next() {
        nextNotCalled = false;
      }, trap() {
        trapCalled = true;
      }
    } as StepControl);
    expect([trapCalled, nextNotCalled]).toEqual([true, true]);
  });
});
