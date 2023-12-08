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
  currentFilter: Company[] = [];
  
  constructor(private companyService: CompaniesService) {}

  ngOnInit(): void {
    this.loadCompanies();
  } 

  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      this.companies = companies;
    })
  }

  clickHandlerNull() {
    this.currentFilter = this.companies.filter(company => company.razaoSocial == null)
  }

  clickHandlerOk() {
    this.currentFilter = this.companies.filter(company => company.razaoSocial)
  }

}
