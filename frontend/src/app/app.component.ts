import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarHelperService } from './services/sidebar-helper.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DialogHelperService } from './services/dialog-helper.service';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { environment } from '../environments/environment';
import { Navigation, NavigationService } from './services/navigation.service';
import { ProcessHelperService } from 'process-helper';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  @HostBinding('class.is-blurred') isBlurred = false;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  mobileQuery: MediaQueryList;
  showSideNav: boolean;

  private readonly mobileQueryListener: (p: any) => void;
  private unsubscribe$ = new Subject<void>();
  private currentUrl: string; // first url part of current route
  private publicUrlList: string[]; // list of views that do not require login / authentication

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private translate: TranslateService,
    private storage: StorageMap,
    private sidebarHelperService: SidebarHelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private el: ElementRef,
    private dialogHelper: DialogHelperService,
    private navigationService: NavigationService,
    private processHelperService: ProcessHelperService,
    private dateAdapter: DateAdapter<Date>,
  ) {

    this.dateAdapter.setLocale(this.translate.currentLang);
    this.translate.onLangChange.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.dateAdapter.setLocale(this.translate.currentLang);
    });

    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('assets/fonts/mdi.svg'));
    matIconRegistry.addSvgIcon('oc_logo', domSanitizer.bypassSecurityTrustResourceUrl('assets/images/oc_logo.svg'));

    this.publicUrlList = [
      'login',
      'signup',
      'join',
      'password-reset',
    ];

    this.dialogHelper.isDialogOpen()
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(result => {
        this.isBlurred = result;
      });

    this.mobileQuery = media.matchMedia('(max-width: 65rem)');
    this.mobileQueryListener = (p) => {
      this.showSideNav = !p.matches; // if we loose mobile size, do not show sidenav as over
      this.sidenav.toggle(!p.matches);
      setTimeout(() => this.changeDetectorRef.detectChanges());
    };
    if (this.mobileQuery) {
      // Fix issue: Safari uses deprecated addListener method
      if (typeof this.mobileQuery.addEventListener === 'function') {
        this.mobileQuery.addEventListener('change', this.mobileQueryListener);
      } else if (typeof this.mobileQuery.addListener === 'function') {
        this.mobileQuery.addListener(this.mobileQueryListener);
      }
    }

    this.showSideNav = !this.mobileQuery.matches;

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.storage.get('language')
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe((result: string) => {
        if (result) {
          translate.use(result);
        } else {
          translate.use('en');
        }
      });

    moment.locale('de');
    registerLocaleData(localeDe);

    // setup: watch router events and catch first url part => activated view
    this.router.events.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(next => {
      if (next instanceof NavigationStart) {
        this.currentUrl = null;
      }
      if (next instanceof NavigationEnd) {
        const urlParts = next.urlAfterRedirects.split('/');
        this.currentUrl = urlParts.length >= 2 ? urlParts[1] : null;
      }
    });

    // setup: watch for auth state, and check current url against public / private urls
    this.authService.authState$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(authenticated => {
      if (!authenticated) {
        this.processHelperService.stopAll();
        if (this.currentUrl && this.publicUrlList.indexOf(this.currentUrl) === -1) {
          this.navigationService.go(Navigation.LOGIN);
        }
      }
    });

    // Update lang tag on html element on language change
    this.translate.onLangChange.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      const lang = document.createAttribute('lang');
      lang.value = this.translate.currentLang;
      this.el.nativeElement.parentElement.parentElement.attributes.setNamedItem(lang);
    });
  }

  ngAfterViewInit(): void {
    this.sidenav.closedStart.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(next => {
      this.showSideNav = false;
    });
    this.sidebarHelperService.showState$.subscribe(next => {
      this.showSideNav = next || !this.mobileQuery.matches;
      this.sidenav.toggle(this.showSideNav);
    });
  }

  ngOnInit() {
    this.el.nativeElement.parentElement.classList.add(`app-version-${environment.appVersion}`);
    if (!environment.production) {
      this.el.nativeElement.parentElement.classList.add('dev');
    }
  }

  ngOnDestroy(): void {
    if (this.mobileQuery) {
      if (typeof this.mobileQuery.removeEventListener === 'function') {
        this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
      } else if (typeof this.mobileQuery.removeListener === 'function') {
        this.mobileQuery.removeListener(this.mobileQueryListener);
      }
    }

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleSidenav() {
    this.showSideNav = !this.showSideNav;
    this.sidenav.toggle(this.showSideNav);
  }
}
