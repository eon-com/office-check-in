import {AssertStep} from './assert-step';
import {StepControl} from '../core/step-control';

describe('AssertStep', () => {
  it('should evaluate predicate and invoke next when true ', async (done) => {
    const assertStep = new AssertStep('0', () => true);
    const callStep = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        assertStep.activate(undefined, {
          next() {
            resolve(true);
          }
        } as StepControl<any>);
      });
    };

    const r = await callStep();
    expect(r).toBeTrue();
    done();
  });

  it('should evaluate predicate and not invoke next but invoke stop when false ', async (done) => {
    const assertStep = new AssertStep('0', () => false);
    const callStep = async (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        assertStep.activate(undefined, {
          next() {
            reject();
          },
          stop() {
            resolve(true);
          }
        } as StepControl<any>);
      });
    };

    const r = await callStep();
    expect(r).toBeTrue();
    done();
  });
});
