import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input()
  public set name(name: string) {
    if (name?.length > 0) {
      const nameArray = name.trim()?.replace(/[ ]+/ig, ' ')?.split(' ') || [];
      this.initials = nameArray.map(part => part.charAt(0) !== 'ß' ? part.charAt(0).toUpperCase() : part.charAt(0) || '').join('');
    } else {
      this.initials = '';
    }
  }

  public initials: string;

  constructor() {
  }

  ngOnInit(): void {
  }
}
