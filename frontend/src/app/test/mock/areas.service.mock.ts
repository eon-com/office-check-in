import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {CreateAreaResult, JoinAreaResult} from '../../services/areas.service';
import {Area} from '../../models/area.model';

@Injectable({
  providedIn: 'root',
})
export class AreasServiceMock {

  constructor() {
  }

  public async create(name: string, capacity: number, address: string, creatorId: string): Promise<CreateAreaResult | Area> {
    return new Promise(async (resolve, reject) => {
      const newAreaSnapshot = {
        id: 1,
        data: () => ({
          locationName: 'new location',
          capacity: 5,
          locationAddress: 'location address',
          creator: {
            id: 1,
          },
        }),
      };

      resolve(Area.deserialize(newAreaSnapshot));
    });
  }

  public findAreaByName(name: string): Observable<Area | null> {
    return null;
  }

  public joinArea(areaId: string, areaName: string, userId: string): Observable<JoinAreaResult> {
    return from(new Promise<JoinAreaResult>(async (resolve, reject) => {
      resolve(JoinAreaResult.OK);
    }));
  }

  public get(id: string): Observable<Area> {
    return of(null);
  }

  public list(areaIds: string[]): Observable<Area[]> {
    return of([]);
  }

  public update(areaId: string, data: Partial<Area>): Observable<boolean> {
    return of(true);
  }
}
