import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularFireAuthMock extends AngularFireAuth {           // added this class
  public login() {
  }

  public logout() {
  }
}

@Injectable()
export class AngularFirestoreMock extends AngularFirestore {

}
