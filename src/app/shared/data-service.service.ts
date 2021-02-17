import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }

  setToken(token: string) {
    window.sessionStorage.setItem('_token', token);
  }
  getToken(): string {
    return window.sessionStorage.getItem('_token');
  }
  setUsers(email: string) {
    window.sessionStorage.setItem('email', email);
  }
  getUsers(): string {
    return window.sessionStorage.getItem('email');
  }
  clearSession(): void {
    window.sessionStorage.clear();
  }
  storeTask(data: any) {
    window.localStorage.setItem('list', JSON.stringify(data));
  }
  getTask() {
    return JSON.parse(window.localStorage.getItem('list'));
  }
  clearStorage() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
}
