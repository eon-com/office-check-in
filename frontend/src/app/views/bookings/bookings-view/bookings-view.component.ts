import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { BookingsService } from '../../../services/bookings.service';
import { Booking } from '../../../models/booking.model';
import { DialogHelperService, DialogResult } from '../../../services/dialog-helper.service';
import { DatePipe } from '@angular/common';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AreasService } from '../../../services/areas.service';
import { ProcessHelperService } from 'process-helper';
import { map, switchMap, takeUntil } from 'rxjs/operators';

export interface BookingViewModel extends Booking {
  dateKey: string;
  presence: number;
}

@Component({
  selector: 'app-booking-view',
  templateUrl: './bookings-view.component.html',
  styleUrls: ['./bookings-view.component.scss'],
  animations: [fadeInAnimation],
})
export class BookingsViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  public displayedColumns: string[] = ['date', 'room', 'presence', 'action'];

  public dataSource = null;

  private unsubscribe$ = new Subject<void>();
  /**
   * Contains bookings which are in the process of being removed
   * @private
   */
  private upForRemoval: string[] = [];

  constructor(
    private bookingsService: BookingsService,
    private areasService: AreasService,
    private dialogHelper: DialogHelperService,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private processHelperService: ProcessHelperService,
  ) {
  }

  ngOnInit(): void {
    this.loadRecentBookings();
  }

  requestBookingDelete(booking: BookingViewModel) {
    this.upForRemoval.push(booking.dateKey);
    this.processHelperService.builder<{ dialogResult: DialogResult }>()
      .dialog('confirmation', 'BOOKINGS.ADD.DIALOG.CONFIRMATION.TITLE',
        'BOOKINGS.ADD.DIALOG.CONFIRMATION.MESSAGE', ['COMMON.BUTTONS.CANCEL', 'COMMON.BUTTONS.DELETE'],
        null, 'help', 'dialogResult')
      .assert((ctx) => ctx.dialogResult?.clickIndex === 1, () => {
        this.removeFromRemoval(booking);
      })
      .reckon(() => this.bookingsService.delete(booking))
      .do(() => this.removeFromRemoval(booking))
      .dialog(
        'success',
        'BOOKINGS.LIST.TABLE.ACTION.DELETE_BOOKING',
        this.translateService.instant('BOOKINGS.LIST.TABLE.ACTION.DELETE_BOOKING_CONF', {
          date: this.datePipe.transform(booking.date),
          teamArea: booking.area,
        }),
        ['COMMON.BUTTONS.OK'],
        null
      )
      .run('bookings-confirmation-dialog', this.unsubscribe$, this, () => {
        this.removeFromRemoval(booking);
        this.showDeleteBookingError();
      });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }

  isDeleting(booking: BookingViewModel): boolean {
    return this.upForRemoval.includes(booking.dateKey);
  }

  private loadRecentBookings(): void {
    this.bookingsService.fetchUser()
      .pipe(
        map(user => this.mapToBookingViewModels(user)),
        map(bookings => this.filterRecentBookings(bookings)),
        switchMap(recentBookings => {
          const areaIds = this.collectAreaIds(recentBookings);

          if (areaIds.length > 0) {
            return this.areasService.list(areaIds)
              .pipe(
                map(areas => this.augmentBookingsWithAreas(recentBookings, areas))
              );
          }
          return of(recentBookings);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        recentBookings => this.dataSource = recentBookings,
        () => this.dataSource = false
      );
  }

  private removeFromRemoval(booking: BookingViewModel): void {
    this.upForRemoval = this.upForRemoval.filter(dateKey => dateKey !== booking.dateKey);
  }

  // noinspection JSMethodCanBeStatic
  private collectAreaIds(bookings: BookingViewModel[]): string[] {
    const areaIds = [];
    for (const booking of bookings) {
      if (areaIds.indexOf(booking.areaId) === -1) {
        areaIds.push(booking.areaId);
      }
    }
    return areaIds;
  }

  private augmentBookingsWithAreas(bookings: BookingViewModel[], areas: any[]): BookingViewModel[] {
    bookings.forEach((booking) => {
      const area = areas.find(x => x.id === booking.areaId);
      if (area) {
        const u = area.utilization.find(x => x.date === booking.dateKey);
        booking.presence = u?.reservations ?? 0;
      }
    });
    return bookings;
  }

  // noinspection JSMethodCanBeStatic
  private mapToBookingViewModels(user: any): BookingViewModel[] {
    const bookings: BookingViewModel[] = [];
    for (const bookingDate in user.bookings) {
      if (user.bookings.hasOwnProperty(bookingDate)) {
        const areaId = user.bookings[bookingDate];
        bookings.push(
          {
            date: new Date(bookingDate),
            dateKey: bookingDate,
            area: user.areas[areaId],
            areaId,
            presence: 0,
          } as BookingViewModel
        );
      }
    }
    return bookings;
  }

  private filterRecentBookings(bookings: BookingViewModel[]): BookingViewModel[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return bookings
      .filter(x => x.date >= now)
      .sort((a, b) => {
        const keyA = a.date;
        const keyB = b.date;
        // Compare the 2 dates
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
  }

  private showDeleteBookingError() {
    this.dialogHelper.showErrorDialog({
      title: this.translateService.instant('BOOKINGS.ADD.ERRORS.DELETE_BOOKING_TITLE'),
      message: this.translateService.instant('BOOKINGS.ADD.ERRORS.DELETE_BOOKING_MESSAGE'),
    });
  }
}
