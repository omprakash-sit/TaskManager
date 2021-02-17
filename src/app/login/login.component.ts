import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from '../shared/data-service.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(
    private loginService: LoginService,
    private ds: DataServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  checkValidForm() {
    if (this.email && this.password) {
      return true;
    } else {
      return false;
    }
  }
  login() {
    this.loginService.authenticate({email: this.email, password: this.password}).subscribe((response: HttpResponse<any>) => {
      if (response.body) {
        this.ds.setToken(response.body['token']);
        this.ds.setUsers(this.email);
        this.router.navigate(['/dashboard']);
      }
    }, (error) => alert('Invalid email id or password'));
  }
}
