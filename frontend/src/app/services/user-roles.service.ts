import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  constructor(
    private angularFirestore: AngularFirestore
  ) { }

  public isManager(userId: string): Observable<boolean> {
    const adminRolePath = `users/${userId}/roles/admin`;
    return this.angularFirestore.doc(adminRolePath)
      .get()
      .pipe(
        map(x => {
          return x.exists;
        })
      );
  }

  async elevateToManager(userId: string) {
    await this.angularFirestore.doc<any>(`users/${userId}/roles/admin`).set({});
  }
}
