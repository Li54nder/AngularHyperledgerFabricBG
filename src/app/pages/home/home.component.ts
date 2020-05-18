import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToGlossary() {
    this.router.navigate(['/glossary']);
    window.scrollTo(0, 0);
  }
  
  navigateToGuide() {
    this.router.navigate(['/guide']);
    window.scrollTo(0, 0);
  }
}
