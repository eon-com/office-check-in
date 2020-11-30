import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';
import {UnsupportedBrowserModule} from './app/unsupported-browser.module';

if (environment.production) {
  enableProdMode();

  const extraData = (optionalParams) => {
    const extra: any = {};
    if (optionalParams) {
      extra.data = optionalParams;
    }
    return extra;
  };

  // side note: IE11 does not really like this (if no console exists)
  // side note: when this works, IE11 hangs at login button..
  console = ((oldConsole) => {
    return {
      log: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.log(message, optionalParams);
        }
      },
      trace: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.trace(message, optionalParams);
        }
      },
      info: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.info(message, optionalParams);
        }
      },
      debug: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.debug(message, optionalParams);
        }
      },
      warn: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.warn(message, optionalParams);
        }
      },
      error: (message?: any, ...optionalParams: any[]) => {
        if (oldConsole) {
          oldConsole.error(message, optionalParams);
        }
      },
    } as Console;
  })(window.console);

  // Redefine the old console
  window.console = console;
}

// Check if browser is IE and show unsupported message
const isIE = !!(document as any).documentMode;
const isEdge = !isIE && !!window.StyleMedia;

if (isIE || isEdge) {
  platformBrowserDynamic().bootstrapModule(UnsupportedBrowserModule)
    .then(app => {
    })
    .catch(err => console.error(err));
} else {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .then(app => {
    })
    .catch(err => console.error(err));
}
