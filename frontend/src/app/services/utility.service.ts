import {Injectable} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  constructor(
    private clipboard: Clipboard,
  ) {
  }

  public copyToClipboard(value: string): boolean {
    return this.clipboard.copy(value);
  }
}
