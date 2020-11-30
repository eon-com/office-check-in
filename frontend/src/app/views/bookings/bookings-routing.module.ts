import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookingsViewComponent} from './bookings-view/bookings-view.component';
import {AddBookingViewComponent} from './add-booking-view/add-booking-view.component';
import {PostBookingInfoViewComponent} from './post-booking-info-view/post-booking-info-view.component';


const routes: Routes = [
  {
    path: '',
    component: BookingsViewComponent,
  },
  {
    path: 'add',
    component: AddBookingViewComponent,
  },
  {
    path: 'done',
    component: PostBookingInfoViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule {
}
