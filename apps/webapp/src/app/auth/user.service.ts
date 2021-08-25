import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUp } from '@speek/common-definitions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = '/gateway/users';

  constructor(private _http: HttpClient) { }

  create(user: SignUp) {
    return this._http.post(this.api, user);
  }
}
