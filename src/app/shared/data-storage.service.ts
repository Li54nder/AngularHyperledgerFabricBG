import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient, private authService: AuthService) {}
    // , private questionService: QuestionService

    // storeNewQuestion() {
    //     // const questions = this.questionService.getQuestions();
    //     this.http
    //         .put(
    //             '',
    //             questions
    //         )
    //         .subscribe(response => {
    //             console.log(respone);
    //         }
    //         );
    // }
    
    fetchQuestions() {
        return this.http
            .get(
                'https://test-38ac4.firebaseio.com/questions.json'
            )
            .pipe(map(res => {
                return Object.keys(res).map(key => {
                    return res[key];
                })
            }));

        // //EXHAUSTMAP - ceka da se prvi obzrvabl zavrsi pa onda krece sa sledecim
        // return this.authService.user.pipe(
        //     take(1), 
        //     exhaustMap(user => {
        //         return this.http
        //             .get(
        //                 'https://test-38ac4.firebaseio.com/questions.json',
        //                 {
        //                     params: new HttpParams().set('auth', user.token)
        //                 }
        //             )
        //     }), 
        //     map(res => {
        //         return Object.keys(res)
        //             .map(key => {
        //                 return res[key];
        //             });
        //     })
        // );
    
        // return this.http
        //     .get<{[key: string]: any}[]>(
        //         'https://test-38ac4.firebaseio.com/questions.json'
        //     )
        //     .pipe(
        //         map(res => {
        //             return Object.keys(res)
        //                 .map(key => {
        //                     return res[key];
        //                 });
        //         })
        //     );
    }
}