import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css'],
})
export class GuideComponent implements OnInit {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  openSnackBar(message, action) {
    this.snackBar.open(message, action, { duration: 4000 });
  }

  goToGlossary() {
    this.router.navigate(['/glossary']);
  }
}
