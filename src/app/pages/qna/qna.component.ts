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
      rate: 0,
      timestamp: new Date().getTime(),
      voters: { up: new Array(), down: new Array() },
    });
    this.dataStorage.uQuestions.next(this.questions);
    this.dataStorage.saveQuestions();

    form.reset();
  }

  upvote(i: number) {
    this.vote(i, true);
  }

  downvote(i: number) {
    this.vote(i, false);
  }

  vote(i: number, up: boolean) {
    if(!this.questions[i].voters) {
      this.questions[i].voters = {
        up: new Array(),
        down: new Array()
      };
    }

    // Bring up current user
    let tmpUser: User;
    this.authService.user.pipe(take(1)).subscribe((x) => {
      tmpUser = x;
    });
    // Check if you want to upvote or downvote
    if (up) {
      if (
        // If you already voted up then you want to remove your vote... Okay
        this.questions[i].voters.up &&
        this.questions[i].voters.up.includes(tmpUser.email)
      ) {
        this.questions[i].rate--;
        this.questions[i].voters.up = this.questions[i].voters.up.filter(
          (x) => {
            console.log(x);
            console.log(tmpUser.email);
            return x !== tmpUser.email;
          }
        );
        this.sortQuestions();
        this.saveQuestions();
        return;
      }
      // Otherwise
      if (
        // If you vote up, but you VOTED DOWN before then remove that 1 downvote
        this.questions[i].voters.down &&
        this.questions[i].voters.down.includes(tmpUser.email)
      ) {
        this.questions[i].rate++;
        this.questions[i].voters.down = this.questions[i].voters.down.filter(
          (x) => {
            console.log(x);
            console.log(tmpUser.email);
            return x !== tmpUser.email;
          }
        );
      }
      // Now include your upvote
      this.questions[i].rate++;
      if (!this.questions[i].voters.up) {
        this.questions[i].voters.up = new Array();
      }
      this.questions[i].voters.up.push(tmpUser.email);
    } else {
      // You want to downvote
      if (
        // If you already voted down then you want to remove your vote... Okay
        this.questions[i].voters.down &&
        this.questions[i].voters.down.includes(tmpUser.email)
      ) {
        this.questions[i].rate++;
        this.questions[i].voters.down = this.questions[i].voters.down.filter(
          (x) => {
            console.log(x);
            console.log(tmpUser.email);
            return x !== tmpUser.email;
          }
        );
        this.sortQuestions();
        this.saveQuestions();
        return;
      }
      // Otherwise
      if (
        // If you vote down, but you VOTED UP before then remove that 1 upvote
        this.questions[i].voters.up &&
        this.questions[i].voters.up.includes(tmpUser.email)
      ) {
        this.questions[i].rate--;
        this.questions[i].voters.up = this.questions[i].voters.up.filter(
          (x) => {
            console.log(x);
            console.log(tmpUser.email);
            return x !== tmpUser.email;
          }
        );
      }
      // Now include your upvote
      this.questions[i].rate--;
      if (!this.questions[i].voters.down) {
        this.questions[i].voters.down = new Array();
      }
      this.questions[i].voters.down.push(tmpUser.email);
    }
    // Save changes for two *Otherwise
    this.sortQuestions();
    this.saveQuestions();
  }

  sortQuestions() {
    this.questions.sort((a, b) => (a.rate > b.rate ? -1 : 1));
  }

  saveQuestions() {
    this.dataStorage.uQuestions.next(this.questions);
    this.dataStorage.saveQuestions();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
