import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ResponseData } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmitForm(form: NgForm) {
    let authObs: Observable<ResponseData>;

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        this.router.navigate(['/q-and-a']);
        // form.reset()
      },
      (error) => {
        if (error.error && error.error.error) {
          switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
              this.error = 'This email already exists.';
              break;
            case 'EMAIL_NOT_FOUND':
              this.error = 'Account with this email not found.';
              break;
            case 'INVALID_PASSWORD':
              this.error = 'Password you entered is invalid.';
              break;
            default:
              this.error = 'An unknown error occured.';
              break;
          }
        }
        this.isLoading = false;
      }
    );
  }
}
