import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import {Booking} from '../../models/booking.model';
import {Area} from '../../models/area.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsServiceMock {
  private readonly items: Observable<object[]>;

  constructor(
    private angularFirestore: AngularFirestore,
  ) {
    this.items = of([]);
  }

  public fetchUser() {
    return of([]);
  }

  public async addBookings(options: { area: Area, dates: Date[] }) {
    return;
  }

  public async delete(booking: Booking) {
    return true;
  }
}
