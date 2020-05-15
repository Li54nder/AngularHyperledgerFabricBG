import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-byfn',
  templateUrl: './byfn.component.html',
  styleUrls: ['./byfn.component.css'],
})
export class BYFNComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {}

  openSnackBar(message, action) {
    this.snackBar.open(message, action, { duration: 4000 });
  }
  navigateToGuide() {
    this.router.navigate(['/guide']);
  }
}
