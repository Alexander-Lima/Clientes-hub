import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/clients.service';
import { Company } from '../interfaces/company';
import { RegisterService } from '../services/register.service';


@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css'],
})
export class CompaniesListComponent implements OnInit{
  companies!: Company[];
  hasResults: boolean = true;
  filterCount!: number;
  
  constructor(private companyService: CompaniesService, private registerService: RegisterService) {}
  
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

  deleteClient(clientCode: string|null) {
    if(clientCode == null) return;
    this.registerService.deleteClient(clientCode).subscribe(
      {
        error: (err) => console.log(err),
        complete: () => {
          this.companies = this.companies.filter((c) => c.codigo != clientCode);
        }
      });
  }
}
