import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarHelperService {

  public showState$: ReplaySubject<boolean>;

  constructor() {
    this.showState$ = new ReplaySubject<boolean>(1);
  }

  public toggle(isOpen: boolean) {
    this.showState$.next(isOpen);
  }
}
