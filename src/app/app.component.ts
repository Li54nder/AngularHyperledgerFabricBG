import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  dispalyFooter = true;
  title = 'HyperledgerFabricBGCS';

  constructor(private router: Router) {
    router.events
      .subscribe(() => {
        this.dispalyFooter = router.url !== '/auth';
      });
  }
}
