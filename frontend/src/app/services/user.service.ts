import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { AppUser } from '../models/user.model';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private database: AngularFirestore) {
  }

  getUserRef(firebaseUser: User | string): AngularFirestoreDocument {
    const uid = typeof firebaseUser === 'string' ? firebaseUser : firebaseUser.uid;
    return this.database.doc(`users/${uid}`);
  }

  public async getUser(firebaseUser: User): Promise<AppUser> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return this.getUserRef(firebaseUser).get()
      .pipe(
        map(user => {
          return AppUser.deserialize(user);
        }),
      ).toPromise();
  }

  public getUserAsObservable(firebaseUser: User): Observable<AppUser> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return this.getUserRef(firebaseUser).valueChanges()
      .pipe(
        map(user => {
          return AppUser.deserialize(user);
        }),
      );
  }

  public async createUser(firebaseUser: User, options?: { email: string, password: string, teamname?: string, teamrole?: string }) {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }

    let docData = {
      email: firebaseUser.email,
    };
    if (options?.teamname && options?.teamrole) {
      docData = Object.assign({}, docData, {
        teamname: options.teamname,
        teamrole: options.teamrole,
      });
    }

    try {
      await this.getUserRef(firebaseUser).set(docData);
    } catch (e) {
      console.error('creating user doc failed', e);
    }


    // Set user role
    if (options?.teamname && options?.teamrole) {
      await this.database.doc<any>(`users/${firebaseUser.uid}/roles/admin`).set({});
    }
  }

  public async updateUser(firebaseUser: User, properties: { [key: string]: string }): Promise<boolean> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }

    try {
      const userDoc = this.getUserRef(firebaseUser);
      const user = (await userDoc.get().toPromise()).data();

      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          user[key] = properties[key];
        }
      }

      await userDoc.update(user);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
