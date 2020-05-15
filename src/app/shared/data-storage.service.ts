import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchQuestions() {
    return this.http
      .get('https://test-38ac4.firebaseio.com/questions.json')
      .pipe(
        map((res) => {
          return Object.keys(res).map((key) => {
            return res[key];
          });
        })
      );
  }
}
