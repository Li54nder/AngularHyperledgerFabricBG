import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private ROOT_URL: string = 'https://test-38ac4.firebaseio.com';
  public unansweredQuestions: any[] = new Array();
  public uQuestions = new BehaviorSubject<any>(null);
  // data = 
  //     [
  //       {
  //         subject: "sadfdfasdfsjalkdfjsadl",
  //         content: "fdslkajfgodsjigaiofjlkdj"
  //       },
  //       {
  //         subject: "fdasdfas",
  //         content: "contfasfdasfdent"
  //       }
  //     ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  // fetchQuestions() {
  //   return this.http
  //     .get(this.ROOT_URL + '/questions.json')
  //     .pipe(
  //       map((res) => {
  //         return Object.keys(res).map((key) => {
  //           return res[key];
  //         });
  //       })
  //     );
  // }
  fetchQuestions() {
    this.http
      .get(this.ROOT_URL + '/questions.json')
      .pipe(
        map((res) => {
          console.log("Fetching questions...");
          return Object.keys(res).map((key) => {
            return res[key];
          });
        })
      )
      .subscribe(res => {
        res.sort((a, b) => (a.rate > b.rate)? -1 : 1);
        this.uQuestions.next(res);
        this.unansweredQuestions = res;
      })
  }

  fetchAnsweredQuestions() {
    return this.http.get(this.ROOT_URL + '/QnA.json').pipe(
      map((res) => {
        return Object.keys(res).map((key) => {
          return res[key];
        })
      })
    );
  }

  saveQuestions() {

    let data;
    this.uQuestions.pipe(take(1)).subscribe(r => {
      console.log(r);
      // r = r.slice(5, r.length);
      data = JSON.stringify(r);
      console.log(data);
    })
    
    this.http.put(this.ROOT_URL + '/questions.json', data).subscribe();
  }
  // putQuestion(subject: string, content: string) {
  //   const timespamp = new Date().getTime() + "";
  //   const data = 
  //     [
  //       {
  //         subject: subject,
  //         content: content
  //       },
  //       {
  //         subject: "subject",
  //         content: "content"
  //       }
  //     ];
  //   return this.http.put(this.ROOT_URL + '/questions.json', data,)
  // }
}
