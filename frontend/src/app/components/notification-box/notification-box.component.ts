import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss'],
})
export class NotificationBoxComponent implements OnInit {

  @Input()
  message: string;

  @Input()
  icon: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
