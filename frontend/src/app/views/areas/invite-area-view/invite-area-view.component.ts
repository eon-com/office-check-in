import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {UtilityService} from '../../../services/utility.service';
import {AreasService} from '../../../services/areas.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Area} from '../../../models/area.model';
import {fadeInAnimation} from '../../../animations/fade-in.animation';
import {Navigation} from '../../../services/navigation.service';
import {ToastHelperService} from '../../../services/toast-helper.service';

@Component({
  selector: 'app-invite-area-view',
  templateUrl: './invite-area-view.component.html',
  styleUrls: ['./invite-area-view.component.scss'],
  animations: [fadeInAnimation],
})
export class InviteAreaViewComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  private unsubscribe$: Subject<void> = new Subject<void>();

  public area: Area;
  public Navigation = Navigation;

  constructor(
    private utilityService: UtilityService,
    private areasService: AreasService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastHelperService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(param => {
        const areaId = param.get('areaId');

        this.areasService.get(areaId)
          .pipe(
            takeUntil(this.unsubscribe$),
          )
          .subscribe(area => {
            this.area = area;
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public buildJoinLink(areaId: string): string {
    const location = window.location.origin;
    return `${location}/join/${areaId}`;
  }

  public copyToClipboard(areaId: string): void {
    this.utilityService.copyToClipboard(this.buildJoinLink(encodeURIComponent(areaId)));

    this.toastService.open('AREAS.LIST.JOIN_LINK_COPIED', {
      data: {
        icon: 'check',
      },
    });
  }

}
