import {from, Observable, of, ReplaySubject} from 'rxjs';
import {auth, User} from 'firebase/app';
import {AppUser} from '../../models/user.model';
import {APP_USER} from './user.service.mock';

export class AuthServiceMock {
  public get firebaseUser() {
    return {
      email: 'test@localhost.space',
    };
  }

  private stateSubject = new ReplaySubject<boolean>(1);
  public authState$ = this.stateSubject.asObservable();

  public async getAuthenticatedUser(firebaseUser?: User): Promise<AppUser> {
    return of(APP_USER).toPromise();
  }

  public getAuthenticatedUserAsObservable(firebaseUser?: User): Observable<AppUser> {
    return from(this.getAuthenticatedUser(firebaseUser));
  }

  public async login(email: string, password: string): Promise<auth.UserCredential> {
    return {
      user: this.firebaseUser as any,
      credential: null,
    };
  }

  public async logout(): Promise<void> {
    return;
  }

  public async signup(options: { email: string, password: string, teamname?: string, teamrole?: string }): Promise<auth.UserCredential> {
    return {
      user: this.firebaseUser as any,
      credential: null,
    };
  }

  public async sendAccountVerificationEmail(user: User): Promise<void> {
    return;
  }

  public async passwordReset(email: string): Promise<void> {
    return;
  }

  public async isAuthenticated(): Promise<boolean> {
    return of(true).toPromise();
  }
}
