import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './user.module';
import { Router } from '@angular/router';

export interface ResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localID: string;
    registred?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<ResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD49_K6-hYtJBMArAnwiYHJLPbiUuKv5Yk',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }            
        )
        .pipe(tap(resData => this.handleAuth(resData.email, resData.localID, resData.idToken, +resData.expiresIn)));
    }

    login(email:string, password: string) {
        return this.http.post<ResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD49_K6-hYtJBMArAnwiYHJLPbiUuKv5Yk',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )        
        .pipe(tap(resData => this.handleAuth(resData.email, resData.localID, resData.idToken, +resData.expiresIn)));
    }

    private handleAuth(email: string, userId:string, token: string, expiresIn: number) {
        const expData = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expData);
        this.user.next(user);
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        // setTimeout(() => {
        //     window.location.reload();
        // }, 2000);
    }
}