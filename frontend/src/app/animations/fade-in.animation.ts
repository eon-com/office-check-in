import {animate, style, transition, trigger} from '@angular/animations';

export const fadeInAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('fadeInAnimation', [
    // route 'enter' transition
    transition(':enter', [

      // css styles at start of transition
      style({opacity: 0}),

      // animation and styles at end of transition
      animate('.5s', style({opacity: 1})),
    ]),
  ]);
