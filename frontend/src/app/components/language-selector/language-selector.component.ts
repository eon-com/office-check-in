import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

  public availableLanguages = ['en', 'de'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private userService: UserService,
    private storage: StorageMap,
  ) {
  }

  ngOnInit(): void {
    this.storage.watch('language')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: string) => {
        if (result) {
          this.translateService.use(result);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public async switchLanguage(language: string) {
    // if user is authenticated write language change into user profile
    if (this.authService.firebaseUser) {
      await this.userService.updateUser(this.authService.firebaseUser, {
        language,
      });
    }

    await this.storage.set('language', language).toPromise();
    this.translateService.use(language);
  }

  get currentLanguage() {
    return this.translateService.currentLang;
  }
}
