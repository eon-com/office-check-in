import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageSelectorComponent} from './language-selector.component';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [LanguageSelectorComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
  ],
  exports: [
    LanguageSelectorComponent,
  ],
})
export class LanguageSelectorModule {
}
