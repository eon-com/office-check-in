import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {UnsupportedBrowserComponent} from './unsupported-browser.component';

@NgModule({
  declarations: [
    UnsupportedBrowserComponent,
  ],
  imports: [
    BrowserModule,

  ],
  bootstrap: [UnsupportedBrowserComponent],
  exports: [
    UnsupportedBrowserComponent,
  ],
})
export class UnsupportedBrowserModule {
}
