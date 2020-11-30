import { Component, OnInit } from '@angular/core';
import {Area} from '../../models/area.model';

@Component({
  selector: 'app-join-area-dialog-message',
  templateUrl: './join-area-dialog-message.component.html',
  styleUrls: ['./join-area-dialog-message.component.scss']
})
export class JoinAreaDialogMessageComponent implements OnInit {

  public data: Area;

  constructor() { }

  public ngOnInit(): void {
  }

}
