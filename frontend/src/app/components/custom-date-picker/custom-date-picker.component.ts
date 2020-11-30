import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { RoomBookingStatus } from '../../views/bookings/add-booking-view/add-booking-view.component';
import { Subject } from 'rxjs';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss'],
})
export class CustomDatePickerComponent implements OnInit, OnDestroy {

  @Input()
  dateIsSelectable: (date: Date) => RoomBookingStatus;

  @Input()
  dateClass: (date: Date) => string;

  @Input()
  maxSelectableDates = 3;

  @Input()
  dateInputLabel = '';
  @Input()
  dateInputHint = '';
  @Input()
  datesToSelectRemainingLabel = '';
  @Input()
  openCalendarButtonLabel = '';

  @Output()
  dateSelectionChanged: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  @ViewChild('inputField', {static: true})
  dateInputFieldRef: ElementRef;

  @ViewChild(MatDatepickerInput, {static: true})
  datepickerInput: MatDatepickerInput<Date>;

  fromDate = moment().toDate();
  toDate = moment().add(1, 'year').endOf('month').toDate();
  currentDate: Date | null = null;

  daysSelected: Date[] = [];

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDateClass = (date: any): string => {
    const dateClass = this.dateClass(date);
    if (dateClass) {
      return dateClass;
    }

    return this.daysSelected.find(x => x.getTime() === date.getTime()) ? 'selected' : null;
  }

  isDaySelectable = (date: Date): boolean => {
    const isDaySelected = this.daysSelected.some(selectedDate => moment(date).isSame(moment(selectedDate)));
    let dateIsSelectable = (this.daysSelected.length < this.maxSelectableDates) && moment(date).isoWeekday() < 7 || isDaySelected;
    if (dateIsSelectable) {
      dateIsSelectable = this.isDaySelectableCallback(date); // Date available callback
    }
    return dateIsSelectable;
  }

  onDateSelect(event: MatDatepickerInputEvent<Date>): void {
    this.clearInputField();
    this.currentDate = event.value;
    this.updateSelectedDates();
  }

  onDateEnter(): void {
    if (this.currentDate) {
      this.clearInputField();
      this.updateSelectedDates();
    }
  }

  remove(date: Date): void {
    this.daysSelected = this.daysSelected.filter(x => x.getTime() !== date.getTime());
    this.dateSelectionChanged.emit(this.daysSelected);
  }

  private isDaySelectableCallback = (date: Date): boolean => {
    return (typeof this.dateIsSelectable === 'function' && this.dateIsSelectable(date) === RoomBookingStatus.AVAILABLE);
  }

  private clearInputField(): void {
    this.datepickerInput.writeValue(null);
    this.dateInputFieldRef.nativeElement.value = '';
  }

  private updateSelectedDates(): void {
    if (!this.currentDate || !this.isDaySelectable(this.currentDate)) {
      return;
    }

    const index = this.daysSelected.findIndex(x => {
      if (this.currentDate && this.currentDate instanceof Date) {
        return x.getTime() === this.currentDate.getTime();
      }
      return false;
    });
    if (index < 0) {
      this.daysSelected.push(this.currentDate);
    } else {
      this.daysSelected.splice(index, 1);
    }

    this.currentDate = null;
    this.dateSelectionChanged.emit(this.daysSelected);
  }
}
