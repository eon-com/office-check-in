import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePickerComponent } from './custom-date-picker.component';
import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [CustomDatePickerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
  ],
  exports: [
    CustomDatePickerComponent,
  ],
  providers: [],
})
export class CustomDatePickerModule {
}
