import {DeferStep} from './defer-step';
import {StepControl} from '../core/step-control';


describe('DeferStep', () => {

  it('should invoke next', async (done) => {
    const s = new DeferStep('0', 0);
    const callStep = async (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        s.activate(undefined, {
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

  it('should not invoke next', async (done) => {
    const t = 5;
    const s = new DeferStep('0', t);
    const callStep = async (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        s.activate(undefined, {
          next() {
            reject();
          }
        } as StepControl<any>);
        s.deactivate();
        setTimeout(() => resolve(true), t * 2);
      });
    };

    const r = await callStep();
    expect(r).toBeTrue();
    done();
  });
});

