import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public status = {'logged': false, 'loading': false};
  public user?: User;


  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToastrService,
  ) {
    window.addEventListener('message', this.onLoginComplete.bind(this), false);
    this.loadUser();
  }

  private readonly BASE_URL = '/api_frontend';

  public loadUser() {
    this.status.loading = true;
    return this.http.get<User>(this.BASE_URL + '/user_profile')
      .subscribe({
        next: user => this._processUser(user),
        error: error => this.toaster.error(error.error.error),
        complete: () => this.status.loading = false,
      });
  }

  public processUser(user: User) {
    this._processUser({...user});
  }

  // process user data
  private _processUser(user: User) {
    if (!user) {
      this.status.logged = false;
      return
    }

    this.status.logged = true;
    this.user = user;
  }

  public logout() {
    this.status.loading = true;
    this.http.get(this.BASE_URL + '/logout', {responseType: 'text'})
      .subscribe({
        next: () => this._logout(),
        complete: () => this.status.loading = false,
      });
  }

  private _logout() {
    this.user = undefined;
    this.status.logged = false;
    this.router.navigate(['/']);
  }

  public loginGoogle() {
    this._openPopup('/login/google-oauth2/', '/login/close_login_popup');
  }

  public loginFacebook() {
    this._openPopup('/login/facebook/', '/login/close_login_popup');
  }

  private _openPopup(url: string, next: string) {
    const settings = 'height=700,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes';
    let to_open = url + '?next=' + next;
    if (environment.production) {
      to_open += '?url=https://' + window.location.host;
    } else {
      to_open = 'http://localhost:8000' + to_open + '?url=http://' + window.location.host;
    }
    let popup;
    popup = window.open(to_open, 'popup', settings);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      if (environment.production) {
        window.location.href = url + '?next=/';
      } else {
        window.location.href = 'http://localhost:8000' + url + '?next=/';
      }
    }
  }

  private onLoginComplete(event: any) {
    if (event.data.first_name) {
      this.processUser(event.data);
    }
  }

  public signUp(registrationData: any) {
    this.status.loading = true;

    return new Promise<User>((resolve, reject) => {
      this.http.post<User>(this.BASE_URL + '/signup', registrationData).subscribe({
        next: user => {this._processUser(user); resolve(user)},
        error: error => {this.toaster.error(error.error.error); reject(error.error)},
      });
    }).finally(() => this.status.loading = false)
  }

  public logIn(loginForm: any) {
    this.status.loading = true;

    return new Promise<User>((resolve, reject) => {
      this.http.post<User>(this.BASE_URL + '/login', loginForm).subscribe({
        next: user => {this._processUser(user); resolve(user)},
        error: error => {this.toaster.error(error.error.error); reject(error.error)},
      });
    }).finally(() => this.status.loading = false)
  }
}
