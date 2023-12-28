import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../interfaces/company';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent {
  @Input() companies!: Company[];
  @Output() hasFilterResults = new EventEmitter();

  applyFilter(input: HTMLInputElement) {
    let hasResults: boolean = false;
    if(input.value == null || input.value == "") return;
    for(let company of this.companies) {
      company.show = false;
      for(let value of Object.values(company)) {
        if(value != null && value.toString().toUpperCase().includes(input.value.toUpperCase())) {
          company.show = true;
          hasResults = true;
          break;
        }
      }
    }
    this.hasFilterResults.emit(hasResults);
  }
  
  resetFilter(input: HTMLInputElement) {
    if(input.value != "") return; 
    if(this.companies.length > 0) {
      this.hasFilterResults.emit(true);
      this.companies.forEach(company => company.show = true);
    }
  }

  onKeyPress(event: KeyboardEvent, input: HTMLInputElement) {
    if(event.key == "Enter") {
      this.applyFilter(input);
    }
  }

}
