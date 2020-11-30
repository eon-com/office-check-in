import {Component, ElementRef, OnInit} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './unsupported-browser.component.html',
  styleUrls: ['./unsupported-browser.component.scss'],
})
export class UnsupportedBrowserComponent implements OnInit {

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
    if (!environment.production) {
      this.el.nativeElement.parentElement.classList.add('dev');
    }
  }
}
