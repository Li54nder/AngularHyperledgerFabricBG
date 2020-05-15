import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './pages/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  dispalyFooter = true;
  title = 'HyperledgerFabricBGCS';

  constructor(private router: Router, private authService: AuthService) {
    router.events.subscribe(() => {
      this.dispalyFooter = router.url !== '/auth';
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }
}
