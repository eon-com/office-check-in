import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToastComponent} from '../components/toast/toast.component';
import {MatSnackBarConfig} from '@angular/material/snack-bar/snack-bar-config';

@Injectable({
  providedIn: 'root',
})
export class ToastHelperService {

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  public open(message: string, config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      panelClass: 'toast',
      politeness: 'polite',
      duration: 4000,
      data: {},
    };
    const useConfig = Object.assign({}, defaultConfig, config);
    useConfig.data.message = message;
    this.snackBar.openFromComponent(ToastComponent, useConfig);
  }
}
