import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/companies.service';
import { Company } from '../interfaces/company';


@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css']
})
export class CompaniesListComponent implements OnInit{
  companies: Company[] = [];
  
  constructor(private companyService: CompaniesService) {}
  
  ngOnInit(): void {
    this.loadCompanies();
  } 
  
  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      companies.forEach(company => company.show = true)
      this.companies = companies;
    })
  }
  filterChange(change: HTMLInputElement) {
    if(change.value == null && change.value == "") return;
    for(let company of this.companies) {
      company.show = false;
      for(let value of Object.values(company)) {
        if(value != null && value.toString().includes(change.value.toUpperCase())) {
          company.show = true;
          break;
        }
      }
    }
  }
}
