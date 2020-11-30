import {Component, HostBinding, OnInit} from '@angular/core';
import {fadeInAnimation} from '../../../animations/fade-in.animation';
import { Navigation } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-post-booking-info-view',
  templateUrl: './post-booking-info-view.component.html',
  styleUrls: ['./post-booking-info-view.component.scss'],
  animations: [fadeInAnimation],
})
export class PostBookingInfoViewComponent implements OnInit {
  @HostBinding('@fadeInAnimation') fadeInAnimation = '';

  public Navigation = Navigation;

  constructor() {
  }

  ngOnInit(): void {
  }

}
