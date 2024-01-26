import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { Company } from 'src/app/general-vision-module/interfaces/company';
import { CompaniesService } from 'src/app/general-vision-module/services/clients.service';
import { Colors } from 'src/app/enums/Colors';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit{
  constructor(private companyService: CompaniesService) {}
  private colorsRegime: string[] = [Colors.GREY, Colors.BLUE]
  private colorsVinculosSefaz: string[] = [Colors.GREEN, Colors.YELLOW]
  private colorsVinculosPrefeitura: string[] = [Colors.ORANGE, Colors.GREY]
  private colorsResponsaveisPrefeitura: string[] = [Colors.GREY, Colors.BLUE, Colors.ORANGE]
  private colorsResponsaveisEstado: string[] = [Colors.GREY, Colors.BLUE, Colors.ORANGE, Colors.YELLOW]
  private colorsSituacao: string[] = [Colors.GREEN, Colors.BLACK, Colors.YELLOW, Colors.GREY, Colors.RED]
  public showCharts = false;
  public pieChartOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        align: 'center',
        position: 'bottom',
        labels: {
          boxWidth: 15
        }
      }
    }
  };

  public pieChartLabelsRegime: string[] = [];
  public pieChartDatasetsRegime = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsRegime }];

  public pieChartLabelsSituacao: string[] = [];
  public pieChartDatasetsSituacao = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsSituacao }];

  public pieChartLabelsResponsaveisPrefeitura: string[] = [];
  public pieChartDatasetsResponsaveisPrefeitura = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsResponsaveisPrefeitura }];

  public pieChartLabelsResponsaveisEstado: string[] = [];
  public pieChartDatasetsResponsaveisEstado = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsResponsaveisEstado }];

  public pieChartLabelsVinculosInscricoesSefaz: string[] = [];
  public pieChartDatasetsVinculosInscricoesSefaz = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsVinculosSefaz }];

  public pieChartLabelsVinculosInscricoesPrefeitura: string[] = [];
  public pieChartDatasetsVinculosInscricoesPrefeitura = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsVinculosPrefeitura }];

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe((companies: Company[]) => {
      if(companies[0]?.codigo) {
        this.setPieChartData(companies);
        this.showCharts = true;
      }
    })
  };
  
  setPieChartData(companies: Company[]) {
    const data: Map<string, Map<string, number>> = this.getDataMap(companies);

    for(let entry of data.entries()) {
      switch(entry[0]) {
        case "REGIME":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsRegime.push(innerEntry[0]);
            this.pieChartDatasetsRegime[0].data.push(innerEntry[1]);
          }
          break;
        case "SITUACAO":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsSituacao.push(innerEntry[0]);
            this.pieChartDatasetsSituacao[0].data.push(innerEntry[1]);
          }
          break;
        case "PREFEITURA":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsResponsaveisPrefeitura.push(innerEntry[0]);
            this.pieChartDatasetsResponsaveisPrefeitura[0].data.push(innerEntry[1]);
          }
          break;
        case "ESTADO":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsResponsaveisEstado.push(innerEntry[0]);
            this.pieChartDatasetsResponsaveisEstado[0].data.push(innerEntry[1]);
          }
          break;
        case "VINCULOS SEFAZ":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsVinculosInscricoesSefaz.push(innerEntry[0]);
            this.pieChartDatasetsVinculosInscricoesSefaz[0].data.push(innerEntry[1]);
          }
          break;
        case "VINCULOS PREFEITURA":
          for(let innerEntry of entry[1]) {
            this.pieChartLabelsVinculosInscricoesPrefeitura.push(innerEntry[0]);
            this.pieChartDatasetsVinculosInscricoesPrefeitura[0].data.push(innerEntry[1]);
          }
      }
    }
  }

  private getDataMap(companies: Company[]): Map<string, Map<string, number>> {
    const data = new Map<string, Map<string, number>>();
    data.set("REGIME", new Map<string, number>());
    data.set("SITUACAO", new Map<string, number>());
    data.set("PREFEITURA", new Map<string, number>());
    data.set("ESTADO", new Map<string, number>());
    data.set("VINCULOS SEFAZ", new Map<string, number>());
    data.set("VINCULOS PREFEITURA", new Map<string, number>());

    for(let company of companies) {
      populateMapByChartName(company.regimeApuracao, "REGIME");
      populateMapByChartName(company.situacao, "SITUACAO");
      populateMapByChartName(company.responsavelPrefeitura, "PREFEITURA", "Sem responsável");
      populateMapByChartName(company.responsavelSefaz, "ESTADO", "Sem responsável");
      populateMapVinculoSefaz(companies);
      populateMapVinculoPrefeitura(companies);
    }
    return data;

    function populateMapByChartName(field: string | null, chartName: string, nullLabel: string = "N/D") {
      const fieldContent: string = field != undefined ? field.toUpperCase() : nullLabel.toUpperCase();
      if(data.get(chartName)?.has(fieldContent)) {
        const currentValue: number | undefined =  data.get(chartName)?.get(fieldContent);
        if(currentValue != undefined) {
          data.get(chartName)?.set(fieldContent, currentValue + 1);
        }
      } else {
        data.get(chartName)?.set(fieldContent, 1);
      }
    }

    function populateMapVinculoSefaz(companies: Company[]) {
      const companiesWithInscricaoEstadual = companies.filter(c => c.inscricaoEstadual);
      const companiesWithoutResponsavel = companiesWithInscricaoEstadual.filter(c => !c.responsavelSefaz);
      data.get("VINCULOS SEFAZ")
          ?.set("VINCULADO AO CONTADOR", companiesWithInscricaoEstadual.length - companiesWithoutResponsavel.length);
      data.get("VINCULOS SEFAZ")
          ?.set("NÃO VINCULADO AO CONTADOR", companiesWithoutResponsavel.length);
    }

    function populateMapVinculoPrefeitura(companies: Company[]) {
      const companiesWithInscricaoMunicipal = companies.filter(c => c.inscricaoMunicipal);
      const companiesWithoutResponsavel = companiesWithInscricaoMunicipal.filter(c => !c.responsavelPrefeitura);
      data.get("VINCULOS PREFEITURA")
          ?.set("VINCULADO AO CONTADOR", companiesWithInscricaoMunicipal.length - companiesWithoutResponsavel.length);
      data.get("VINCULOS PREFEITURA")
          ?.set("NÃO VINCULADO AO CONTADOR", companiesWithoutResponsavel.length);
    }
  }
}

