import {Directive, ElementRef, HostListener} from '@angular/core';
import {SidebarHelperService} from '../../services/sidebar-helper.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[CloseSidebar], [close-sidebar]'
})
export class CloseSidebarDirective {

  @HostListener('click') onClick() {
    this.sidebarHelperService.toggle(false);
  }

  constructor(
    private sidebarHelperService: SidebarHelperService,
  ) {}

}
