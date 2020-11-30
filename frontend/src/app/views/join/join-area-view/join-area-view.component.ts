import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AreasService, JoinAreaResult} from '../../../services/areas.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Area} from '../../../models/area.model';
import {DialogHelperService} from '../../../services/dialog-helper.service';
import {JoinAreaDialogMessageComponent} from '../../../components/join-area-dialog-message/join-area-dialog-message.component';
import {fadeInAnimation} from '../../../animations/fade-in.animation';
import {TranslateService} from '@ngx-translate/core';
import {Navigation, NavigationService} from '../../../services/navigation.service';


export enum JoinViewState {
  CHECK_USER = 'check_user',
  NOT_AUTHORIZED = 'not_authorized',
  JOIN_AREA = 'join_area',
  AREA_NOT_FOUND = 'area_not_found',
  JOIN_AREA_SUCCEEDED = 'join_area_succeeded',
  JOIN_AREA_FAILED = 'join_area_failed',
}


@Component({
  selector: 'app-join-area-view',
  templateUrl: './join-area-view.component.html',
  styleUrls: ['./join-area-view.component.scss'],
  animations: [fadeInAnimation],
})
export class JoinAreaViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  public data: any;
  public state: JoinViewState;
  public areaId: string;
  public isAuthed: boolean;
  private areaSub: Subscription;
  private unsubscribe$: Subject<void>;

  constructor(
    private authService: AuthService,
    private areasService: AreasService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogHelperService: DialogHelperService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.unsubscribe$ = new Subject<void>();
    this.state = JoinViewState.CHECK_USER;
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(next => {
      this.onParamMapChange(next);
    });

    this.authService.authState$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      next => this.onAuthStateChange(next),
    );
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public gotoLogin(): void {
    this.navigationService.go(Navigation.LOGIN);
  }

  public gotoMyAreas(): void {
    this.navigationService.go(Navigation.AREAS);
  }

  private onParamMapChange(paramMap: ParamMap): void {
    this.areaId = paramMap.get('areaName');
    if (this.areaId) {
      this.checkAreaName();
    }
  }

  private onAuthStateChange(authed: boolean): void {
    this.isAuthed = authed;
    if (authed) {
      this.state = JoinViewState.JOIN_AREA;
      this.checkAreaName();
    } else {
      this.state = JoinViewState.NOT_AUTHORIZED;
    }
  }

  private checkAreaName() {
    if (!this.areaId || !this.isAuthed) {
      return;
    }
    if (this.areaSub) {
      this.areaSub.unsubscribe();
    }
    this.areaSub = this.areasService
      .get(this.areaId)
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(
        next => this.foundArea(next),
      );
  }

  private foundArea(area: Area | null): void {
    if (!area) {
      this.state = JoinViewState.AREA_NOT_FOUND;
      return;
    }
    this.tryJoinTeam(area, this.navigationService);
  }

  private tryJoinTeam(area: Area, navigationService: NavigationService) {
    this.areasService
      .joinArea(area.id, area.locationName, this.authService.firebaseUser.uid)
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(next => {
      if (next === JoinAreaResult.OK) {
        this.state = JoinViewState.JOIN_AREA_SUCCEEDED;
        this.dialogHelperService.showSuccessDialog({
          title: 'DIALOGS.JOIN_AREA.TITLE',
          message: 'DIALOGS.JOIN_AREA.MESSAGE',
          content: {
            element: JoinAreaDialogMessageComponent,
            data: area,
          },
          buttons: [{
            type: 'close',
          }, {
            type: 'raised',
            text: 'JOIN.BUTTONS.MY_BOOKINGS.TITLE',
            click: () => {
              navigationService.go(Navigation.BOOKINGS);
            },
          }],
        });
      } else {
        this.navigationService.go(Navigation.BOOKINGS);
      }
    }, error => {
      console.error(error);
      this.state = JoinViewState.JOIN_AREA_FAILED;
    });
  }
}
