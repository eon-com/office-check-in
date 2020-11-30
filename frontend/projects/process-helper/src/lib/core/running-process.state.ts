import {ProcessState} from './process-state';

export interface RunningProcessState {
  [key: string]: ProcessState;
}
