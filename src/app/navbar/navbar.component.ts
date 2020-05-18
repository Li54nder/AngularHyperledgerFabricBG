import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuth = false;
  private userSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
