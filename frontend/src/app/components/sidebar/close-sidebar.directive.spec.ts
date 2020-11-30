import {CloseSidebarDirective} from './close-sidebar.directive';
import {SidebarHelperService} from '../../services/sidebar-helper.service';

describe('CloseSidebarDirective', () => {
  it('should create an instance', () => {
    const directive = new CloseSidebarDirective(
      new SidebarHelperService(),
    );
    expect(directive).toBeTruthy();
  });
});
