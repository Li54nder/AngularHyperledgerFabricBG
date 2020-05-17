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
  rating: {sum: number, votes: number, users: {}};
  private currUser: User;

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {
    dataStorage.uQuestions.subscribe(data => {
      this.questions = data;
    });
    // dataStorage.rating.pipe(take(1)).subscribe(data => {
    //   this.rating = data;
    //   // this.averageRating = data.average;
    // })
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
      this.currUser = user;
    });

    // Better way to fetch data. Subscribe in component!
    this.dataStorage.fetchRating().subscribe(res => {     
      this.rating = res; 
      if (res.users[this.currUser.email.replace('.', '-')]) {
        let x: HTMLElement = document.querySelector('#star_'+res.users[this.currUser.email.replace('.', '-')]);
        x.click();       
      }
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
    this.initVoters(i);
    if (
      // If you already voted up then you want to remove your vote... Okay
      this.questions[i].voters.up &&
      this.questions[i].voters.up.includes(this.currUser.email)
    ) {
      this.questions[i].rate--;
      this.questions[i].voters.up = this.questions[i].voters.up.filter(
        (x) => {
          return x !== this.currUser.email;
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
      this.questions[i].voters.down.includes(this.currUser.email)
    ) {
      this.questions[i].rate++;
      this.questions[i].voters.down = this.questions[i].voters.down.filter(
        (x) => {
          return x !== this.currUser.email;
        }
      );
    }
    // Now include your upvote
    this.questions[i].rate++;
    if (!this.questions[i].voters.up) {
      this.questions[i].voters.up = new Array();
    }
    this.questions[i].voters.up.push(this.currUser.email);
    // Save changes for two *Otherwise
    this.sortQuestions();
    this.saveQuestions();
  }

  downvote(i: number) {
    this.initVoters(i);
    if (
      // If you already voted down then you want to remove your vote... Okay
      this.questions[i].voters.down &&
      this.questions[i].voters.down.includes(this.currUser.email)
    ) {
      this.questions[i].rate++;
      this.questions[i].voters.down = this.questions[i].voters.down.filter(
        (x) => {
          return x !== this.currUser.email;
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
      this.questions[i].voters.up.includes(this.currUser.email)
    ) {
      this.questions[i].rate--;
      this.questions[i].voters.up = this.questions[i].voters.up.filter(
        (x) => {
          return x !== this.currUser.email;
        }
      );
    }
    // Now include your upvote
    this.questions[i].rate--;
    if (!this.questions[i].voters.down) {
      this.questions[i].voters.down = new Array();
    }
    this.questions[i].voters.down.push(this.currUser.email);
    // Save changes for two *Otherwise
    this.sortQuestions();
    this.saveQuestions();
  }
  
  initVoters(i: number) {
    if(!this.questions[i].voters) {
      this.questions[i].voters = {
        up: new Array(),
        down: new Array()
      };
    }
  }

  sortQuestions() {
    this.questions.sort((a, b) => (a.rate > b.rate ? -1 : 1));
  }

  saveQuestions() {
    this.dataStorage.uQuestions.next(this.questions);
    this.dataStorage.saveQuestions();
  }

  onRating(i: number) {
    let email = this.currUser.email;
    email = email.replace('.', '-')
    if(this.rating.users[email]) {
      this.rating.sum -= this.rating.users[email]
      this.rating.votes--;
    }
    this.rating.sum += i;
    this.rating.votes++;
    this.rating.users[email] = i;
    this.dataStorage.saveRating(this.rating);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
