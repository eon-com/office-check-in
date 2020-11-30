import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AreasService } from '../../../services/areas.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Area } from '../../../models/area.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { DialogHelperService, DialogResult } from '../../../services/dialog-helper.service';
import { fadeInAnimation } from 'src/app/animations/fade-in.animation';
import { Navigation, NavigationService } from '../../../services/navigation.service';
import { MyProcessVar, ProcessHelperService, ServiceError, ServiceErrorCode } from 'process-helper';

@Component({
  selector: 'app-edit-area-view',
  templateUrl: './edit-area-view.component.html',
  styleUrls: ['./edit-area-view.component.scss'],
  animations: [fadeInAnimation],
})
export class EditAreaViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  @MyProcessVar('area') public area: Area;

  editAreaForm: FormGroup;
  editAreaBtnOption: MatProgressButtonOptions;

  private readonly unsubscribe$: Subject<void>;

  constructor(
    private router: Router, private activatedRoute: ActivatedRoute,
    private areasService: AreasService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private dialogHelperService: DialogHelperService,
    private navigationService: NavigationService,
    private processHelperService: ProcessHelperService
  ) {
    this.unsubscribe$ = new Subject<void>();
    this.editAreaBtnOption = {
      active: false,
      text: this.translateService.instant('EDIT_AREA.BUTTONS.SAVE.TITLE'),
      spinnerSize: 19,
      fullWidth: true,
      raised: true,
      buttonColor: 'primary',
      spinnerColor: 'primary',
      mode: 'indeterminate',
      disabled: true,
    };

    this.translateService.stream('EDIT_AREA.BUTTONS.SAVE.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe((res: string) => {
      this.editAreaBtnOption.text = res;
    });
  }

  ngOnInit(): void {
    this.editAreaForm = this.formBuilder.group({
      locationName: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      address: ['', [Validators.required]],
    });
    this.editAreaForm.statusChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(next => this.updateButton(next));
    this.loadArea();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editArea(): void {
    if (this.editAreaBtnOption.active || this.editAreaForm.invalid) {
      return;
    }

    const formValue = this.editAreaForm.getRawValue();
    const saveArea$ = this.areasService.update(
      this.area.id,
      {
        locationName: formValue.locationName,
        capacity: formValue.capacity,
        locationAddress: formValue.address,
      },
    );

    this.runSaveProcess(saveArea$);
  }

  private loadArea() {
    const areaService = this.areasService;
    const authService = this.authService;

    this.processHelperService.builder<{
      areaId: string;
      area: Area;
    }>()
      .connect(this.activatedRoute.paramMap.pipe(map(x => x.get('areaId'))), 'areaId')
      .connect<Area>(ctx => areaService.get(ctx.areaId), 'area')
      .do((ctx) => {
        if (ctx.area.creatorId !== authService.firebaseUser.uid) {
          throw new ServiceError(ServiceErrorCode.NOT_AUTHORIZED);
        }
      })
      .do((ctx) => {
        this.editAreaForm.patchValue({
          locationName: ctx.area.locationName,
          capacity: ctx.area.capacity,
          address: ctx.area.locationAddress
        });
      })
      .run('loadArea', this.unsubscribe$, this);
  }

  private updateButton(formStatus: string): void {
    this.editAreaBtnOption = {
      ...this.editAreaBtnOption,
      disabled: formStatus !== 'VALID',
    };
  }

  private runSaveProcess(saveArea$: Observable<boolean>): void {
    const setActive = (active: boolean) => () => {
      this.editAreaBtnOption = {
        ...this.editAreaBtnOption,
        active
      };
    };
    const showErrorDialog = () => this.dialogHelperService.showErrorDialog({
      title: 'EDIT_AREA.DIALOGS.ERROR.TITLE',
      message: 'EDIT_AREA.DIALOGS.ERROR.MESSAGE',
    });
    const ns = this.navigationService;

    this.processHelperService.builder<{ dialogResult: DialogResult }>()
      .do(setActive(true))
      .connect(saveArea$)
      .do(setActive(false))
      .dialog('success', 'EDIT_AREA.DIALOGS.SUCCESS.TITLE',
        'EDIT_AREA.DIALOGS.SUCCESS.MESSAGE', ['COMMON.BUTTONS.OK'],
        null, null, 'dialogResult')
      .do((ctx) => {
        if (ctx?.dialogResult?.clickIndex === 0) {
          ns.go(Navigation.AREAS);
        }
      })
      .run('saveArea', this.unsubscribe$, this, () => {
        setActive(false)();
        showErrorDialog();
      });
  }
}
