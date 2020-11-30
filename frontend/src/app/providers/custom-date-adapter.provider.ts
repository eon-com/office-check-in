import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  parse(value: any): Date | null {
    if (typeof value === 'string') {

      const delimiter = value.includes('/') ? '/' : '.';
      const str = value.split(delimiter);

      if (str.length === 3) {

        const year = Number(str[2].padStart(4, '20'));
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);

        return new Date(year, month, date);
      }
    }
    return null;
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
