/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */
import 'cross-fetch/polyfill';
import 'proxy-polyfill/proxy.min';

import 'core-js/es';

// ie11 console patch - there might be no console object in ie11
// https://www.beyondjava.net/console-log-surprises-with-internet-explorer-11-and-edge
// side note: IE11 hangs at login button..
if (!window.console || Object.keys(window.console).length === 0) {
  window.console = {
    memory: [],
    assert(condition?: boolean, message?: string, ...data: any[]): void {},
    clear(): void{},
    count(label?: string): void{},
    debug(message?: any, ...optionalParams: any[]): void{},
    dir(value?: any, ...optionalParams: any[]): void{},
    dirxml(value: any): void{},
    error(message?: any, ...optionalParams: any[]): void{},
    exception(message?: string, ...optionalParams: any[]): void{},
    group(groupTitle?: string, ...optionalParams: any[]): void{},
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void{},
    groupEnd(): void{},
    info(message?: any, ...optionalParams: any[]): void{},
    log(message?: any, ...optionalParams: any[]): void{},
    markTimeline(label?: string): void{},
    profile(reportName?: string): void{},
    profileEnd(reportName?: string): void{},
    table(...tabularData: any[]): void{},
    time(label?: string): void{},
    timeEnd(label?: string): void{},
    timeStamp(label?: string): void{},
    timeline(label?: string): void{},
    timelineEnd(label?: string): void{},
    trace(message?: any, ...optionalParams: any[]): void{},
    warn(message?: any, ...optionalParams: any[]): void{}
  } as any;
}

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
import 'web-animations-js'; // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
