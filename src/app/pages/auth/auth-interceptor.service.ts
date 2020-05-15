import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorSrvice implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  //EXHAUSTMAP - ceka da se prvi obzrvabl zavrsi pa onda krece sa sledecim
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        } else {
          const modifiedReq = req.clone({
            params: new HttpParams().set('auth', user.token),
          });
          return next.handle(modifiedReq);
        }
      })
    );
  }
}
