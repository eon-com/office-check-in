import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { DialogHelperService } from './services/dialog-helper.service';
import { MyDialogProvider, ProcessHelperDependency, ProcessHelperDependencyDescriptor } from 'process-helper';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter } from './providers/custom-date-adapter.provider';
import { SharedModule } from './shared/shared.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class CustomErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);
  }
}

export function processHelperDialogDep(dialogHelperService: DialogHelperService): ProcessHelperDependencyDescriptor {
  return {
    sym: MyDialogProvider,
    dep: () => () => dialogHelperService.builder()
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
    SharedModule,
    AppRoutingModule,
    SidebarModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    DatePipe,
    {
      provide: ProcessHelperDependency,
      useFactory: processHelperDialogDep,
      deps: [DialogHelperService],
      multi: true
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_NATIVE_DATE_FORMATS
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
