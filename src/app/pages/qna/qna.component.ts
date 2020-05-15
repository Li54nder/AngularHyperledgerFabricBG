import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css'],
})
export class QNAComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  questions: any[] = null;
  isAuth: boolean;

  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dataStorage.fetchQuestions().subscribe((response) => {
      this.questions = response;
    });
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
