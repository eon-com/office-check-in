import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { AddBookingViewComponent } from './add-booking-view/add-booking-view.component';
import { BookingsViewComponent } from './bookings-view/bookings-view.component';
import { PostBookingInfoViewComponent } from './post-booking-info-view/post-booking-info-view.component';
import { SharedModule } from '../../shared/shared.module';
import { BookingSuccessfulDialogContentComponent } from './booking-successful-dialog-content/booking-successful-dialog-content.component';

@NgModule({
  declarations: [
    AddBookingViewComponent,
    BookingsViewComponent,
    PostBookingInfoViewComponent,
    BookingSuccessfulDialogContentComponent
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    SharedModule
  ]
})
export class BookingsModule {
}
