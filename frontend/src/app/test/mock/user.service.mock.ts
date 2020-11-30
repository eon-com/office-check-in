import {Injectable} from '@angular/core';
import {User} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import {AppUser} from '../../models/user.model';

export const APP_USER = AppUser.deserialize({
  id: 1,
  data: () => {
    return {
      email: 'testuser@officecheckin.com',
    };
  },
});

@Injectable({
  providedIn: 'root',
})
export class UserServiceMock {
  constructor(
    private database: AngularFirestore) {
  }

  public async getUser(firebaseUser: User): Promise<AppUser> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return of(APP_USER).toPromise();
  }

  public getUserAsObservable(firebaseUser: User): Observable<AppUser> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return of(APP_USER);
  }

  public async createUser(firebaseUser: User) {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return true;
  }

  public async updateUser(firebaseUser: User, properties: { [key: string]: string }): Promise<boolean> {
    if (!firebaseUser) {
      throw new Error('No firebase user given');
    }
    return true;
  }
}
