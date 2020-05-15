import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { User } from '../pages/auth/user.module';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private ROOT_URL: string = 'https://test-38ac4.firebaseio.com';
  // public unansweredQuestions: any[] = new Array();
  public uQuestions = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchQuestions() {
    this.http
      .get(this.ROOT_URL + '/questions.json')
      .pipe(
        map((res) => {
          console.log('Before ' + JSON.stringify(res));
          return Object.keys(res).map((key) => {
            return res[key];
          });
        })
      )
      .subscribe((res) => {
        console.log('after: ' + JSON.stringify(res));

        res.sort((a, b) => (a.rate > b.rate ? -1 : 1));
        this.uQuestions.next(res);
        // this.unansweredQuestions = res;
      });
  }

  fetchAnsweredQuestions() {
    return this.http.get(this.ROOT_URL + '/QnA.json').pipe(
      map((res) => {
        return Object.keys(res).map((key) => {
          return res[key];
        });
      })
    );
  }

  saveQuestions() {
    let data;
    this.uQuestions
      .pipe(
        take(1),
        map((x) => {
          x.forEach((element) => {
            if (!element.timestamp) {
              console.log('New Question Added To DB');
              setTimeout(() => {
                element.timestamp = new Date().getTime();
              }, 10);
            }
          });
          return x;
        })
      )
      .subscribe((r) => {
        data = JSON.stringify(r);
        // this.fetchVotes();
      });

    this.http.put(this.ROOT_URL + '/questions.json', data).subscribe();
  }

  // saveVote(questionTS: number, up: boolean) {
  //   let user: User;
  //   this.authService.user.pipe(take(1)).subscribe((x) => {
  //     user = x;
  //   });
  //   let votes = this.fetchVotes();
  //   console.log("Fetched Votes: " + votes);
  //   if (!votes) {
  //     votes = {};
  //   }
  //   // console.log(votes);
  //   // console.log(questionTS);
  //   votes[questionTS] = {};
  //   votes[questionTS][(user.email).replace('.', '')] = ((up)? 'UP' : 'DOWN');
  //   // console.log(votes);
  // }
  // fetchVotes() {
  //   let tmp;
  //   let data = this.http
  //     .get(this.ROOT_URL + '/votes.json')
  //     .pipe(take(1))
  //     .subscribe((res) => {
  //       tmp = res;
  //       return res;
  //     });
  //   console.log(tmp);
  //   console.log(data);
  //   return data;
  // }
}
