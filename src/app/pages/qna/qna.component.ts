import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { User } from '../auth/user.module';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css'],
})
export class QNAComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  isAuth: boolean;
  isLoading: boolean = false;
  questions: {
    content: string;
    subject: string;
    rate: number;
    timestamp: number;
    voters: {
      down: string[];
      up: string[];
    };
  }[] = new Array();
  answeredQuestions: any[] = new Array();

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {
    dataStorage.uQuestions.subscribe((data) => {
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
    });

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

    this.questions.push({
      subject: subject,
      content: content,
      rate: 1,
      timestamp: new Date().getTime(),
      voters: { up: new Array(), down: new Array() },
    });
    this.dataStorage.uQuestions.next(this.questions);
    this.dataStorage.saveQuestions();

    form.reset();
  }

  upvote(i: number) {
    // this.vote(this.questions[i].timestamp, true);
    this.vote(i, true);
  }
  downvote(i: number) {
    this.vote(i, false);
  }
  vote(i: number, up: boolean) {
    let tmpUser: User;
    this.authService.user.pipe(take(1)).subscribe((x) => {
      tmpUser = x;
    });
    console.log(this.questions[i]);
    if (up) {
      if (this.questions[i].voters.up.includes(tmpUser.email)) {
        console.log('Vec glasao UP');
        return;
      }
      this.questions[i].rate++;
      this.questions[i].voters.up.push(tmpUser.email);
      this.questions[i].voters.down = this.questions[i].voters.down.filter(
        (x) => {
          x !== tmpUser.email;
        }
      );
    } else {
      if (this.questions[i].voters.down.includes(tmpUser.email)) {
        console.log('Vec glasao DOWN');
        return;
      }
      this.questions[i].rate--;
      this.questions[i].voters.down.push(tmpUser.email);
      this.questions[i].voters.up = this.questions[i].voters.up.filter((x) => {
        x !== tmpUser.email;
      });
    }
    this.sortQuestions();
    this.dataStorage.saveQuestions();
    // this.dataStorage.saveVote(timestamp, up);
  }

  sortQuestions() {
    this.questions.sort((a, b) => (a.rate > b.rate ? -1 : 1));
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
