import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css'],
})
export class QNAComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  isAuth: boolean;
  isLoading: boolean = false;
  questions: any[] = new Array();
  answeredQuestions: any[] = new Array();

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {
    dataStorage.uQuestions.subscribe(data => {
      this.questions = data;
    });
  }

  ngOnInit(): void {
    // this.dataStorage.fetchQuestions().subscribe((res) => {
    //   this.questions = res;
    // });
    this.dataStorage.fetchQuestions();
    this.dataStorage.fetchAnsweredQuestions().subscribe((res) => {
      this.answeredQuestions = res;
    })

    this.userSubscription = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
    });
  }
  
  onSubmitForm(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const subject = form.value.subject;
    const content = form.value.content;

    this.questions.push({subject: subject, content: content, rate: 1});
    this.dataStorage.uQuestions.next(this.questions);
    this.dataStorage.saveQuestions();

    form.reset();
  }

  upvote(i: number) {
    this.questions[i].rate++;
    this.sortQuestions();
  }

  downvote(i: number) {
    this.questions[i].rate--;
    this.sortQuestions();
  }

  sortQuestions() {
    console.log(this.questions);
    this.questions.sort((a, b) => (a.rate > b.rate)? -1 : 1)
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
