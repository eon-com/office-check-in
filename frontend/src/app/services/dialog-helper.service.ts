import {Injectable, Type} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CustomDialogComponent, DialogType} from '../components/custom-dialog/custom-dialog.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MyDialogBuilder} from 'process-helper';

export interface CustomDialogOptions {
  title: string;
  message: string;
  icon?: string;
  content?: { element: Type<any>, data: any };
  buttons?: Array<{ type?: string, text?: string, click?: () => void }>;
}

export interface DialogResult {
  clickIndex: number;
}

class DialogBuilderHelperImpl implements MyDialogBuilder<DialogResult> {
  private config: CustomDialogOptions;
  private dialogType: string;

  constructor(private dialogHelperService: DialogHelperService) {
    this.dialogType = '';
    this.config = {
      title: '',
      message: ''
    };
  }

  public type(t): MyDialogBuilder<DialogResult> {
    this.dialogType = t;
    return this;
  }

  title(text): MyDialogBuilder<DialogResult> {
    this.config.title = text;
    return this;
  }

  message(text): MyDialogBuilder<DialogResult> {
    this.config.message = text;
    return this;
  }

  content(customContent): MyDialogBuilder<DialogResult> {
    this.config.content = customContent;
    return this;
  }

  button(text?: string, type?: string): MyDialogBuilder<DialogResult> {
    if (!this.config.buttons) {
      this.config.buttons = [];
    }
    this.config.buttons.push({
      text,
      type
    });
    return this;
  }

  raisedButton(text?: string): MyDialogBuilder<DialogResult> {
    return this.button(text, 'raised');
  }

  icon(icon?: string): MyDialogBuilder<DialogResult> {
    this.config.icon = icon;
    return this;
  }

  build(): Observable<DialogResult> {
    return new Observable<any>(subscriber => {
      let isValid = true;
      const buttons = this.config.buttons ?? [];
      buttons.forEach((button, index) => {
        button.click = () => {
          if (!isValid) {
            return;
          }
          subscriber.next({
            clickIndex: index
          } as DialogResult);
        };
      });
      let dr: MatDialogRef<any>;
      console.log('build dialog observable', this.dialogType);
      if (this.dialogType === 'error') {
        dr = this.dialogHelperService.showErrorDialog(this.config);
      } else if (this.dialogType === 'success') {
        dr = this.dialogHelperService.showSuccessDialog(this.config);
      } else {
        dr = this.dialogHelperService.showInfoDialog(this.config);
      }

      const closeSub = dr.afterClosed().subscribe(_ => {
        isValid = false;
        subscriber.complete();
      });
      return () => {
        isValid = false;
        closeSub.unsubscribe();
        dr.close();
      };
    });
  }
}


@Injectable({
  providedIn: 'root',
})
export class DialogHelperService {

  private dialogState: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private dialog: MatDialog,
  ) {
  }

  public isDialogOpen(): Observable<boolean> {
    return this.dialogState
      .pipe(
        map(value => {
          return value > 0;
        }),
      );
  }

  public showErrorDialog(options: CustomDialogOptions): MatDialogRef<CustomDialogComponent> {
    return this.openDialog({
        panelClass: 'dialog-error',
        data: {
          icon: 'emoticon-cry-outline',
          ...options,
          type: DialogType.ERROR,
        },
      },
    );
  }

  public showSuccessDialog(options: CustomDialogOptions): MatDialogRef<CustomDialogComponent> {
    return this.openDialog({
        data: {
          icon: 'thumb-up',
          ...options,
          type: DialogType.SUCCESS,
        },
      },
    );
  }

  public showInfoDialog(options: CustomDialogOptions): MatDialogRef<CustomDialogComponent> {
    return this.openDialog({
        data: {
          icon: 'bullhorn',
          ...options,
          type: DialogType.SUCCESS,
        },
      },
    );
  }

  public builder(): MyDialogBuilder<DialogResult> {
    return new DialogBuilderHelperImpl(this);
  }

  private openDialog(dialogConfig: MatDialogConfig): MatDialogRef<any> {
    const defaultDialogConfig: MatDialogConfig = {
      minWidth: 250,
      minHeight: 250,
      maxWidth: 400,
    };
    const config = Object.assign({}, defaultDialogConfig, dialogConfig);
    const dialogRef = this.dialog.open(CustomDialogComponent, config);

    this.dialogState.next(this.dialogState.value + 1);

    dialogRef.afterClosed().subscribe(_ => {
      this.dialogState.next(this.dialogState.value - 1);
    });

    return dialogRef;
  }

  // public showConfirmDialog(options: CustomDialogOptions): MatDialogRef<CustomDialogComponent> {
  //   return this.openDialog({
  //       data: {
  //         ...options,
  //         type: DialogType.SUCCESS,
  //       },
  //     },
  //   );
  // }
}
