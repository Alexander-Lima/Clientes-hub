import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/clients.service';
import { Company } from '../interfaces/company';


@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css'],
})
export class CompaniesListComponent implements OnInit{
  companies!: Company[];
  hasResults: boolean = true;
  filterCount!: number;
  
  constructor(private companyService: CompaniesService) {}
  
  ngOnInit(): void {
    this.loadCompanies();
  } 
  
  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      if(companies[0]?.codigo) {
        companies.forEach(company => company.show = true)
        this.companies = companies;
        this.filterCount = this.companies.length;
      }
    })
  }
}
