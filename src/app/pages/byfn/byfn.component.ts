import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-byfn',
  templateUrl: './byfn.component.html',
  styleUrls: ['./byfn.component.css']
})
export class BYFNComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  
  openSnackBar(message, action) {
    this.snackBar.open(message, action, { duration: 4000});
  }

}
