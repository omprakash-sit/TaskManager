import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'https://reqres.in/';
  constructor(
    private http: HttpClient
  ) { }

  authenticate(req: LoginForm): Observable<HttpResponse<any>> {
    return this.http.post(this.baseUrl + 'api/login', req, { observe: 'response' });
  }
}

export interface LoginForm {
  email: string;
  password: string;
}