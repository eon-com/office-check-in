import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Area } from '../models/area.model';
import { ServiceError, ServiceErrorCode } from 'process-helper';
import * as firebase from 'firebase';

export enum CreateAreaResult {
  Ok,
  NameExistsError,
  InvalidCapacityError,
  InvalidAddressError
}

export enum JoinAreaResult {
  OK = 0,
  ALREADY_JOINED = 1,
}


@Injectable({
  providedIn: 'root',
})
export class AreasService {

  constructor(
    private angularFirestore: AngularFirestore,
  ) {
  }

  public async create(name: string, capacity: number, address: string, creatorId: string): Promise<CreateAreaResult | Area> {
    const areaExistsRef = this.angularFirestore.collection('areas_names').doc(name);
    const creatorRef = this.angularFirestore.collection('users').doc(creatorId);

    if (capacity <= 0) {
      return CreateAreaResult.InvalidCapacityError;
    }

    return this.angularFirestore.firestore.runTransaction(async (tx): Promise<CreateAreaResult | Area> => {
      return new Promise(async (resolve, reject) => {
        const areaLookup = await areaExistsRef.get().toPromise();
        if (areaLookup.exists) {
          resolve(CreateAreaResult.NameExistsError);
          return;
        }
        const newArea = await this.angularFirestore.firestore.collection('areas').add({
          locationName: name,
          capacity,
          locationAddress: address,
          creator: creatorRef.ref,
        });

        const newAreaLookup = this.angularFirestore.firestore.collection('areas_names').doc(name);
        await newAreaLookup.set({
          areaRef: newArea,
        });

        const newAreaSnapshot = {
          id: newArea.id,
          data: () => ({
            locationName: name,
            capacity,
            locationAddress: address,
            creator: {
              id: creatorId
            }
          })
        };

        resolve(Area.deserialize(newAreaSnapshot));
      });
    });
  }

  public findAreaByName(name: string): Observable<Area | null> {
    return new Observable((observer) => {
      const sub = this.angularFirestore
        .collection('areas', ref => ref.where('locationName', '==', name))
        .snapshotChanges()
        .pipe(
          map(changes => {
            return changes.map((item: any) => {
              return Area.deserialize(item.payload.doc);
            });
          }),
        )
        .subscribe(next => {
          if (next.length !== 1) {
            observer.next(null);
          } else {
            observer.next(next[0]);
          }
        }, error => {
          observer.error();
        }, () => {
          observer.complete();
        });

      return () => {
        sub.unsubscribe();
      };
    });
  }

  public joinArea(areaId: string, areaName: string, userId: string): Observable<JoinAreaResult> {
    const db = this.angularFirestore.firestore;
    const userRef = db.doc(`users/${userId}`);
    const areaUserRef = db.doc(`areas/${areaId}/users/${userId}`);

    return from(new Promise<JoinAreaResult>(async (resolve, reject) => {
      try {

        if ((await areaUserRef.get()).exists) {
          resolve(JoinAreaResult.ALREADY_JOINED);
        }

        await db.runTransaction(async (tx) => {
          await userRef.update({
            [`areas.${areaId}`]: areaName,
          });
          await areaUserRef.set({
            joined: new Date().toISOString(),
          });
        });
        resolve(JoinAreaResult.OK);
      } catch (e) {
        console.log('ERROR JOIN AREA', e);
        reject(e);
      }
    }));
  }

  public get(id: string): Observable<Area> {
    return this.angularFirestore.doc(`areas/${id}`).get()
      .pipe(
        map(area => {
          if (!area || !area.exists) {
            throw new ServiceError(ServiceErrorCode.NOT_FOUND);
          }
          return Area.deserialize(area);
        }),
      );
  }

  public list(areaIds: string[]): Observable<Area[]> {
    if (!areaIds || areaIds.length === 0) {
      return from([]);
    }
    const areaObs$ = areaIds.map(id => this.angularFirestore.doc(`areas/${id}`).get());
    const areaSortFunc = (a, b) => {
      if (a.locationName < b.locationName) {
        return -1;
      }
      if (a.locationName > b.locationName) {
        return 1;
      }
      return 0;
    };

    return combineLatest(areaObs$).pipe(
      map(areas => {
        return areas
          .map(areaDoc => Area.deserialize(areaDoc))
          .sort(areaSortFunc);
      })
    );
  }

  public update(areaId: string, data: Partial<Area>): Observable<boolean> {
    return from(new Promise<boolean>(async (resolve, reject) => {
      const result = await firebase.functions().httpsCallable('updateTeamArea')({areaUID: areaId, data}) as any;
      if (result.data.success) {
        resolve(true);
      } else {
        reject(new Error(result.data.message));
      }
    }));
  }

  async deleteArea(areaUID: string): Promise<{ data: { success: boolean, message?: string } }> {
    return await firebase.functions().httpsCallable('deleteTeamArea')({areaUID}) as any;
  }
}
