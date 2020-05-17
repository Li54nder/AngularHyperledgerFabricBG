import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { tap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.css'],
})
export class GlossaryComponent implements OnInit {
  public glossary: { therm: string; definition: string }[];
  public query;

  constructor(private dataStorage: DataStorageService) {}

  ngOnInit(): void {
    this.dataStorage.fetchGlossary().subscribe((res) => {
      res = res.filter((item) => item !== null);
      res.sort((a, b) => {
        return a.therm < b.therm ? -1 : 1;
      });
      this.glossary = res;
    });
  }
}

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  public transform(value, keys: string, term: string) {
    if (!term) return value;
    return (value || []).filter((item) =>
      keys
        .split(', ')
        .some(
          (key) =>
            item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])
        )
    );
  }
}
