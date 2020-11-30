import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    template: `
        <div class="additional-content margin-top">
            <div class="additional-content-line1">
                <ng-container *ngFor="let date of data.dates; let idx = index">{{date | date}}
                    <ng-container *ngIf="data.dates && data.dates.length > 1 && idx < data.dates.length - 1">,</ng-container>
                </ng-container>
            </div>
            <div class="additional-content-line2">{{data.area.locationName}}<span
                    *ngIf="data.area.locationAddress"> - {{data.area.locationAddress}}</span>
            </div>
        </div>`,
    encapsulation: ViewEncapsulation.None,
})
export class BookingSuccessfulDialogContentComponent {
    @Input()
    public data: any;
}
