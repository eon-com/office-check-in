import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

export interface ToastData {
  icon?: string;
  translateParameter?: any;
  message: string;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {


  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData,
  ) { }

  ngOnInit(): void {
  }

}
