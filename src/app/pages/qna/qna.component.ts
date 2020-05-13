import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.css']
})
export class QNAComponent implements OnInit {
  questions: any[] = null;

  constructor(private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.dataStorage.fetchQuestions().subscribe(response => {
      this.questions = response;    
    })
  }

}
