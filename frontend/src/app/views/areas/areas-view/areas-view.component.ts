import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UtilityService } from '../../../services/utility.service';
import { UserRolesService } from '../../../services/user-roles.service';
import { Navigation, NavigationService } from '../../../services/navigation.service';
import { ToastHelperService } from '../../../services/toast-helper.service';
import { AreasService } from '../../../services/areas.service';
import { DialogResult } from '../../../services/dialog-helper.service';
import { ProcessHelperService } from 'process-helper';
import { UserService } from '../../../services/user.service';

export interface AreaItem {
  id: string;
  locationName: string;
  capacity: number;
}

@Component({
  selector: 'app-areas-view',
  templateUrl: './areas-view.component.html',
  styleUrls: ['./areas-view.component.scss'],
  animations: [fadeInAnimation],
})
export class AreasViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  isManager = false;
  managedColumns: string[];
  joinedColumns: string[];
  managedDataSource: AreaItem[] | false | null = null;
  joinedDataSource: AreaItem[] | false | null = null;
  spinningElements: Map<string, boolean> = new Map<string, boolean>();

  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private userService: UserService,
    private userRolesService: UserRolesService,
    private toastService: ToastHelperService,
    private navigationService: NavigationService,
    private areasService: AreasService,
    private processHelperService: ProcessHelperService
  ) {
    this.unsubscribe$ = new Subject<void>();
    this.managedColumns = ['name', 'capacity', 'actions'];
    this.joinedColumns = ['name', 'capacity'];
  }

  public ngOnInit(): void {
    this.loadJoinedAreas();
    this.userRolesService.isManager(this.authService.firebaseUser?.uid)
      .pipe(
        take(1),
        takeUntil(this.unsubscribe$),
        filter(isManager => isManager)
      ).subscribe(() => {
      this.isManager = true;
      this.loadManagedAreas();
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public copyJoinLink(item: AreaItem): void {
    const location = window.location.origin;
    this.utilityService.copyToClipboard(`${location}/join/${encodeURIComponent(item.id)}`);

    this.toastService.open('AREAS.LIST.JOIN_LINK_COPIED', {
      data: {
        icon: 'check',
      },
    });
  }

  public navigateToEditArea(item: AreaItem): void {
    this.navigationService.go(Navigation.AREAS_EDIT, [item.id]);
  }

  public addArea(): void {
    this.navigationService.go(Navigation.AREAS_ADD);
  }

  async deleteArea(element: AreaItem) {
    this.processHelperService.builder<{ dialogResult: DialogResult, deleteResult: { data: { success: boolean, message?: string } } }>()
      .dialog('confirmation', 'AREAS.DELETE.DIALOG.CONFIRMATION.TITLE',
        'AREAS.DELETE.DIALOG.CONFIRMATION.MESSAGE', [{raised: false, text: 'COMMON.BUTTONS.CANCEL'}, {
          raised: true,
          text: 'COMMON.BUTTONS.DELETE'
        }],
        null, 'help', 'dialogResult')
      .assert((ctx) => ctx.dialogResult?.clickIndex === 1)
      .do(() => {
        this.spinningElements.set(element.id, true);
      })
      .reckon(() => this.areasService.deleteArea(element.id), 'deleteResult')
      .do(ctx => {
        this.spinningElements.delete(element.id);
        if (ctx.deleteResult.data.success) {
          this.toastService.open('AREAS.DELETE.TOAST.SUCCESS',
            {data: {icon: 'check', translateParameter: {name: element.locationName}}});
        } else {
          this.toastService.open('AREAS.DELETE.TOAST.FAILURE',
            {data: {icon: 'check', translateParameter: {message: ctx.deleteResult.data.message}}});
        }
      })
      .run('deleteArea', this.unsubscribe$, this);
  }

  becomeTeamManager() {
    this.userRolesService.elevateToManager(this.authService.firebaseUser?.uid).then(_ => {
      this.toastService.open('AREAS.LIST.BECAME_TEAM_MANAGER');
      this.isManager = true;
    });
  }

  private loadJoinedAreas(): void {
    this.userService.getUserAsObservable(this.authService.firebaseUser)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(user => this.areasService.list(user.areas.map(area => area.id))),
        map(areas => {
          return areas.map(area => ({
            id: area.id,
            locationName: area.locationName,
            capacity: area.capacity
          }));
        })
      ).subscribe(next => {
      this.joinedDataSource = next;
    }, error => {
      this.joinedDataSource = false;
    });
  }

  private loadManagedAreas(): void {
    const userRef = this.userService.getUserRef(this.authService.firebaseUser);
    this.angularFirestore
      .collection('areas', ref => ref.where('creator', '==', userRef.ref))
      .snapshotChanges()
      .pipe(
        map(areaDocs => {
          return areaDocs.map(doc => {
            const data: any = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              locationName: data.locationName,
              capacity: data.capacity
            } as AreaItem;
          });
        }),
        map(areas => this.sortAreas(areas)),
        takeUntil(this.unsubscribe$)
      ).subscribe(next => {
      this.managedDataSource = next;
    }, error => {
      this.managedDataSource = false;
    });
  }

  private sortAreas(areas: AreaItem[]): AreaItem[] {
    return areas.sort((a, b) => {
      return a.locationName.localeCompare(b.locationName);
    });
  }

}
