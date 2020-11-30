import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { AreasService } from '../../../services/areas.service';
import { AuthService } from '../../../services/auth.service';
import { DialogHelperService } from '../../../services/dialog-helper.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JoinAreaDialogMessageComponent } from '../../../components/join-area-dialog-message/join-area-dialog-message.component';
import { Area } from '../../../models/area.model';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { Navigation, NavigationService } from '../../../services/navigation.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-area-view',
  templateUrl: './add-area-view.component.html',
  styleUrls: ['./add-area-view.component.scss'],
  animations: [fadeInAnimation],
})
export class AddAreaViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';
  public createAreaForm: FormGroup;
  public createAreaBtnOption: MatProgressButtonOptions;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogHelperService: DialogHelperService,
    private authService: AuthService,
    private areasService: AreasService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.createAreaBtnOption = {
      active: false,
      text: 'Create area',
      spinnerSize: 19,
      fullWidth: true,
      raised: true,
      buttonColor: 'primary',
      spinnerColor: 'primary',
      mode: 'indeterminate',
      disabled: true,
    };

    this.translateService.stream('CREATE_AREA.BUTTONS.CREATE.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe((res: string) => {
      this.createAreaBtnOption.text = res;
    });
  }

  public ngOnInit(): void {
    this.createAreaForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      address: ['', [Validators.required]],
    });
    this.createAreaForm.statusChanges.subscribe(
      next => {
        this.createAreaBtnOption = {
          ...this.createAreaBtnOption,
          disabled: next === 'INVALID',
        };
      },
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public async createArea(): Promise<void> {
    if (this.createAreaBtnOption.active || this.createAreaForm.invalid) {
      return;
    }

    this.createAreaBtnOption = {
      ...this.createAreaBtnOption,
      active: true,
    };

    const formData = this.createAreaForm.getRawValue();
    try {
      const result = await this.areasService.create(
        formData.name,
        formData.capacity,
        formData.address,
        this.authService.firebaseUser.uid,
      );

      this.createAreaBtnOption = {
        ...this.createAreaBtnOption,
        active: false,
      };

      if (result instanceof Area) {
        this.createAreaForm.reset({
          locationName: '',
          capacity: '',
          locationAddress: '',
        });
        this.dialogHelperService.showSuccessDialog({
          title: 'CREATE_AREA.DIALOGS.CREATED.TITLE',
          message: 'CREATE_AREA.DIALOGS.CREATED.MESSAGE',
          content: {
            element: JoinAreaDialogMessageComponent,
            data: result,
          },
          buttons: [{
            text: 'COMMON.BUTTONS.CLOSE',
          }, {
            type: 'raised',
            text: 'CREATE_AREA.BUTTONS.INVITE.TITLE',
            click: () => {
              this.navigationService.go(Navigation.AREAS_INVITE, [result.id]);
            },
          }],
        });
      } else {
        this.dialogHelperService.showErrorDialog({
          title: 'CREATE_AREA.DIALOGS.NAME_EXISTS.TITLE',
          message: 'CREATE_AREA.DIALOGS.NAME_EXISTS.TITLE',
        });
      }

    } catch (e) {
      console.error(e);
      this.dialogHelperService.showErrorDialog({
        title: 'CREATE_AREA.DIALOGS.NAME_EXISTS.TITLE',
        message: 'CREATE_AREA.DIALOGS.NAME_EXISTS.TITLE',
      });
    }
  }
}
