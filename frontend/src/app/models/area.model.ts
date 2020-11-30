import {DocumentData} from '@angular/fire/firestore';
import * as moment from 'moment';


export interface AreaData {
  locationName: string;
  locationAddress: string;
  capacity: number;
  bookings?: {[key: string]: number};
  utilization?: { date: string, reservations: number }[];
}

export class Area {
  public id: string;
  public locationName: string;
  public locationAddress: string;
  public capacity: number;
  public bookings: {[key: string]: number };
  public creatorId: string;
  utilization?: { date: string, reservations: number }[];

  static fromDocumentData(data: DocumentData) {
    const area = new Area();
    /*
    area.locationName = areaData.locationName;
    area.locationAddress = areaData.locationAddress;
    area.capacity = areaData.capacity;
    area.bookings = areaData.bookings ?? {};
     */
    return area;
  }

  static deserialize(object: { [key: string]: any }): Area {
    const data = object.data();
    const area = new Area();
    area.id = object.id;
    area.capacity = data.capacity || 0;
    area.locationAddress = data.locationAddress || null;
    area.locationName = data.locationName || null;
    area.creatorId = data.creator.id;

    if (data.utilization) {
      area.utilization = Object.keys(data.utilization).map(key => {
        return {
          date: key,
          reservations: data.utilization[key],
        };
      });
    } else {
      area.utilization = [];
    }
    return area;
  }

  public hasFreeSeats(date: Date): boolean {
    const utilizationByDate = this.utilization.find(utilization => {
      return utilization.date === moment(date).format('yyyy-MM-DD');
    });
    return utilizationByDate === undefined || utilizationByDate.reservations < this.capacity;
  }
}
