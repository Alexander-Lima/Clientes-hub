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
  showPopup: boolean = false;
  currentClient!: string | null;
  
  constructor(private companyService: CompaniesService, private registerService: RegisterService) {}
  
  ngOnInit(): void {
    this.loadCompanies();
  } 
  
  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      if(companies[0]?.codigo) {
        companies.forEach(company => company.show = true)
        this.companies = companies.filter(c => c.codigo ? c.codigo <= '10' : false);
        this.filterCount = this.companies.length;
      }
    })
  }

  deleteClient(clientCode: string | null) {
    this.currentClient = clientCode;
    this.showPopup = true;
  }

  handleClickYes() {
    if(this.currentClient == null) return;
    this.registerService.deleteClient(this.currentClient ).subscribe(
      {
        error: (err) => {
          console.log(err);
          this.showPopup = false;
        },
        complete: () => {
          this.companies = this.companies.filter((c) => c.codigo != this.currentClient );
          this.showPopup = false;
        }
      });
  }

  handleClickNo() {
    this.showPopup = false;
    this.currentClient = null;
  }
}
