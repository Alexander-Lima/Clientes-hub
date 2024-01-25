import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Company } from 'src/app/general-vision-module/interfaces/company';
import { CompaniesService } from 'src/app/general-vision-module/services/clients.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit{
  constructor(private companyService: CompaniesService) {}

  title = 'ng2-charts-demo';
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabelsRegime: string[] = ["SIMPLES NACIONAL", "NORMAL"];
  public pieChartDatasetsRegime = <ChartDataset<'pie'>[]>[];
  public pieChartPluginsRegime = [];

  public pieChartLabelsSituacao: string[] = [];
  public pieChartDatasetsSituacao = <ChartDataset<'pie'>[]>[];
  public pieChartPluginsSituacao = [];

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      if(companies[0]?.codigo) {
        this.setPieChartDataRegime(companies);
      }
    })
  };
  
  setPieChartDataRegime(companies: Company[]) {
    const data = new Map<string | null, number>();

    for(let company of companies) {
      if(!data.has(company.regimeApuracao)) {
        data.set(company.regimeApuracao, 0);
      } else {
        data.set(company.regimeApuracao, data.get(company.regimeApuracao) + 1);
      }
    }

    // this.pieChartLabelsRegime = 
    this.pieChartDatasetsRegime = [{
      data: [
        companies.filter(c => c.regimeApuracao == "SIMPLES NACIONAL").length,
        companies.filter(c => c.regimeApuracao == "NORMAL").length
      ],
      backgroundColor: ['grey', '#36A2EB'],
    }]
  }

  setPieChartDataSituacao(companies: Company[]) {
    this.pieChartDatasetsRegime = [{
      data: [
        companies.filter(c => c.regimeApuracao == "SIMPLES NACIONAL").length,
        companies.filter(c => c.regimeApuracao == "NORMAL").length
      ],
      backgroundColor: ['grey', '#36A2EB'],
    }]
  }
}
