import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Booking } from '../models/booking.model';
import { firestore } from 'firebase/app';
import { DatePipe } from '@angular/common';
import { Area } from '../models/area.model';
import { fromPromise } from 'rxjs/internal-compatibility';

export class AreaFullError extends Error {
}

export class UserAlreadyBookedDate extends Error {
}

@Injectable({
  providedIn: 'root',
})
export class BookingsService {

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private datePipe: DatePipe,
  ) {
  }

  fetchUser(): Observable<any> {
    const user = this.angularFirestore.doc<any>(`users/${this.authService.firebaseUser.uid}`);
    return user.valueChanges();
  }

  addBookings(options: { area: Area, dates: Date[] }): Observable<boolean> {
    const {area, dates} = options;

    try {
      return fromPromise(this.angularFirestore.firestore.runTransaction(async transaction => {
          await Promise.all(
            dates
              .map(date => this.datePipe.transform(date, 'yyyy-MM-dd'))
              .map(dateAsString => this.addBooking(transaction, area, dateAsString))
          );
          return true;
        }
      ));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async delete(booking: Booking): Promise<boolean> {

    const date = this.datePipe.transform(booking.date, 'yyyy-MM-dd');

    try {
      return await this.angularFirestore.firestore.runTransaction(async transaction => {
        const areaRef = this.angularFirestore.doc<any>(`areas/${booking.areaId}`).ref;
        const areaBookingOnDateRef = this.angularFirestore.doc<any>(`areas/${booking.areaId}/booking/${date}`).ref;
        const userRef = this.angularFirestore.doc<any>(`users/${this.authService.firebaseUser.uid}`).ref;
        const userBookingOnDateRef = this.angularFirestore.doc<any>(`users/${this.authService.firebaseUser.uid}/bookings/${date}`).ref;

        const areaSnapshot = await transaction.get<any>(areaRef);
        const areaBookingOnDate = await transaction.get(areaBookingOnDateRef);

        // Decrease count of area booking on date
        await transaction.update(areaBookingOnDate.ref, {
          count: areaBookingOnDate.data().count - 1,
        });

        // Decrease utilization count on date
        const utilizationCount = areaSnapshot.data().utilization[date] || 0;
        await transaction.update(areaRef, {
          [`utilization.${date}`]: utilizationCount <= 1 ? firestore.FieldValue.delete() : utilizationCount - 1
        });

        // Delete users booking on date
        await transaction.update(userRef, {
          [`bookings.${date}`]: firestore.FieldValue.delete()
        });
        await transaction.delete(userBookingOnDateRef);

        return true;
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async addBooking(transaction: firestore.Transaction, areaToUpdate: Area, date: string): Promise<void> {
    const areaRef = this.angularFirestore.doc<any>(`areas/${areaToUpdate.id}`).ref;
    const userRef = this.angularFirestore.doc<any>(`users/${this.authService.firebaseUser.uid}`).ref;

    const areaBookingsOnDateRef = this.angularFirestore.doc<any>(`areas/${areaRef.id}/booking/${date}`).ref;
    const userBookingsOnDateRef = this.angularFirestore.doc<any>(`users/${this.authService.firebaseUser.uid}/bookings/${date}`).ref;

    // Fetch user bookings
    const userBookingsOnDate = await transaction.get<any>(userBookingsOnDateRef);
    if (userBookingsOnDate.exists) {
      console.error('User booking exists for date:', date);
      throw new UserAlreadyBookedDate();
    }

    // Fetch area and area bookings
    const area = await transaction.get<any>(areaRef);
    const areaBookingsOnDate = await transaction.get<any>(areaBookingsOnDateRef);

    const areaBookingsOnDateUpdate = {
      count: areaBookingsOnDate.exists ? areaBookingsOnDate.data().count : 0,
      capacity: area.data().capacity
    };
    if (areaBookingsOnDateUpdate.count >= areaBookingsOnDateUpdate.capacity) {
      console.error('Area full for date: ', date);
      throw new AreaFullError();
    }

    // Update area bookings
    areaBookingsOnDateUpdate.count = areaBookingsOnDateUpdate.count + 1;
    if (areaBookingsOnDate.exists) {
      await transaction.update(areaBookingsOnDateRef, areaBookingsOnDateUpdate);
    } else {
      await transaction.set(areaBookingsOnDateRef, areaBookingsOnDateUpdate);
    }

    // Update utilization
    await transaction.update(areaRef, {
      [`utilization.${date}`]: (area.data().utilization?.[date] || 0) + 1
    });

    // Insert object to users booking collection
    await transaction.set(userBookingsOnDateRef, {
      date,
      areaId: area.id,
      roomName: area.data().locationName,
    });

    // Update users bookings on date
    await transaction.update(userRef, {
      [`bookings.${date}`]: area.id
    });
  }
}
