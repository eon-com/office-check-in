import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../animations/fade-in.animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaFullError, BookingsService, UserAlreadyBookedDate } from '../../../services/bookings.service';
import { DialogHelperService } from '../../../services/dialog-helper.service';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Router } from '@angular/router';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { AreasService } from '../../../services/areas.service';
import { Area } from '../../../models/area.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';
import { Navigation, NavigationService } from '../../../services/navigation.service';
import { BookingSuccessfulDialogContentComponent } from '../booking-successful-dialog-content/booking-successful-dialog-content.component';

export enum RoomBookingStatus {
  AVAILABLE,
  UNAVAILABLE,
  FULL,
  ALREADY_BOOKED
}

@Component({
  selector: 'app-add-booking-view',
  templateUrl: './add-booking-view.component.html',
  styleUrls: ['./add-booking-view.component.scss'],
  animations: [fadeInAnimation],
})
export class AddBookingViewComponent implements OnInit, OnDestroy {

  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  maxBookableDays = 3;
  areaFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  readonly confirmBookingBtnOptions: MatProgressButtonOptions = {
    active: false,
    disabled: true,
    text: 'Confirm Booking',
    spinnerSize: 19,
    fullWidth: false,
    raised: true,
    buttonColor: 'primary',
    spinnerColor: 'primary',
    mode: 'indeterminate',
  };
  user;
  areas: Area[] | null = null;
  private unsubscribe$ = new Subject<void>();
  private selectedArea: Area;
  private selectedDates: Date[];

  constructor(
    private formBuilder: FormBuilder,
    private areaService: AreasService,
    private bookingsService: BookingsService,
    private dialogHelper: DialogHelperService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.translateService.stream('BOOKINGS.ADD.BUTTONS.ADD_BOOKING.TITLE')
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe((res: string) => {
      this.confirmBookingBtnOptions.text = res;
    });

    this.authService.getAuthenticatedUserAsObservable()
      .pipe(
        tap(user => this.user = user),
        switchMap(user => {
          return this.areaService.list(user.areas.map(area => area.id));
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(
      areas => {
        this.areas = areas;
      }, error => {
        console.error(error);
      });
  }

  isDateBookable: (date: Date) => RoomBookingStatus = (date: Date) => {

    if (!this.user || !this.selectedArea) {
      return RoomBookingStatus.UNAVAILABLE;
    }

    // Check if date is in the future
    if (moment(date) < moment().startOf('day')) {
      return RoomBookingStatus.UNAVAILABLE;
    }
    // Check if user already booked that day
    const dayIsAlreadyBookedByUser = Object.keys(this.user.bookings || {}).find((bookingDate: string) => {
      return moment(date).format('yyyy-MM-DD') === bookingDate;
    });

    if (dayIsAlreadyBookedByUser !== undefined) {
      return RoomBookingStatus.ALREADY_BOOKED;
    }

    return this.selectedArea.hasFreeSeats(date) ? RoomBookingStatus.AVAILABLE : RoomBookingStatus.FULL;
  }

  dateClass = (date: Date) => {
    switch (this.isDateBookable(date)) {
      case RoomBookingStatus.FULL:
        return 'full';
      case RoomBookingStatus.ALREADY_BOOKED:
        return 'already-booked';
      default:
        return null;
    }
  }

  ngOnInit(): void {
    this.areaFormGroup = this.formBuilder.group({
      areaControl: ['', Validators.required],
    });
    this.dateFormGroup = this.formBuilder.group({
      dateControl: ['', Validators.required],
    });
  }

  bookArea(): void {

    try {
      this.confirmBookingBtnOptions.active = true;

      if (this.selectedArea && this.selectedDates && this.selectedDates.length > 0) {

        this.bookingsService.addBookings({
          area: this.selectedArea,
          dates: this.selectedDates,
        })
          .pipe(
            switchMap(() =>
              this.dialogHelper.showSuccessDialog({
                title: 'BOOKINGS.ADD.DIALOG.SUCCESS.TITLE',
                message: 'BOOKINGS.ADD.DIALOG.SUCCESS.MESSAGE',
                content: {
                  element: BookingSuccessfulDialogContentComponent,
                  data: {
                    area: this.selectedArea,
                    dates: this.selectedDates,
                  },
                },
              })
                .afterClosed()
            )
          )
          .subscribe(() => this.navigationService.go(Navigation.BOOKINGS_DONE));
      }
    } catch (e) {
      let errorMessage = 'BOOKINGS.ADD.ERRORS.ERROR_SEAT';
      if (e instanceof AreaFullError) {
        errorMessage = 'BOOKINGS.ADD.ERRORS.AREA_BOOKED';
      }
      if (e instanceof UserAlreadyBookedDate) {
        errorMessage = 'BOOKINGS.ADD.ERRORS.DAY_BOOKED';
      }

      this.dialogHelper.showErrorDialog({
        title: 'BOOKINGS.ADD.ERRORS.BOOK_ERROR',
        message: errorMessage,
      });
    } finally {
      this.confirmBookingBtnOptions.active = false;
    }
  }

  async areaSelected($event) {
    // Load area data
    this.selectedDates = [];
    this.selectedArea = null;
    this.selectedArea = await this.areaService.get($event.value).toPromise();
  }

  dateSelectionChanged(dates: Date[]) {
    this.selectedDates = dates || [];
    this.confirmBookingBtnOptions.disabled = this.selectedDates.length === 0;
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  }
}
