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
  private colorsSituacao: string[] = [Colors.BLUE, Colors.BLACK, Colors.GREY, Colors.YELLOW, Colors.RED]
  private colorsRegime: string[] = [ Colors.GREEN, Colors.YELLOW, Colors.BLUE]
  private colorsResponsaveisPrefeitura: string[] = [Colors.GREY, Colors.BLUE, Colors.ORANGE]
  private colorsResponsaveisEstado: string[] = [Colors.BLUE, Colors.GREY, Colors.ORANGE, Colors.YELLOW]
  private colorsPorte: string[] = [Colors.BLUE, Colors.GREEN, Colors.GREY]
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

  public pieChartLabelsPorte: string[] = [];
  public pieChartDatasetsPorte = 
                          <ChartDataset<'pie'>[]>[{ data: <number[]>[], backgroundColor: this.colorsPorte }];

  public dataSetEstados!: Map<string, number>;

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
  
  private setPieChartData(companies: Company[]) {
    const data: Map<string, Map<string, number>> = this.getDataMap(companies);

    for(let entry of data.entries()) {
      if(entry[0] == "ESTADOS") {
        this.dataSetEstados = entry[1];
      }
      for(let innerEntry of entry[1]) {
        if(entry[0] == "REGIME") {
          this.pieChartLabelsRegime.push(innerEntry[0]);
          this.pieChartDatasetsRegime[0].data.push(innerEntry[1]);
        } else if(entry[0] == "SITUACAO") {
        this.pieChartLabelsSituacao.push(innerEntry[0]);
          this.pieChartDatasetsSituacao[0].data.push(innerEntry[1]);
        } else if(entry[0] == "RESP PREFEITURA") {
          this.pieChartLabelsResponsaveisPrefeitura.push(innerEntry[0]);
          this.pieChartDatasetsResponsaveisPrefeitura[0].data.push(innerEntry[1]);
        } else if(entry[0] == "RESP ESTADO") {
          this.pieChartLabelsResponsaveisEstado.push(innerEntry[0]);
          this.pieChartDatasetsResponsaveisEstado[0].data.push(innerEntry[1]);
        } else if(entry[0] == "PORTE") {
          this.pieChartLabelsPorte.push(innerEntry[0]);
          this.pieChartDatasetsPorte[0].data.push(innerEntry[1]);
        }
      }
    }
  }

  private getDataMap(companies: Company[]): Map<string, Map<string, number>> {
    type ChartFilter = { filter: boolean };
    const data = new Map<string, Map<string, number>>();
    data.set("REGIME", new Map<string, number>());
    data.set("SITUACAO", new Map<string, number>());
    data.set("RESP PREFEITURA", new Map<string, number>());
    data.set("RESP ESTADO", new Map<string, number>());
    data.set("ESTADOS", new Map<string, number>());
    data.set("PORTE", new Map<string, number>());

    for(let company of companies) {
      populateMapByChartName( 
            { filter: company.situacao == 'ATIVA' },
            company.regimeApuracao, 
            "REGIME");
      populateMapByChartName(
            null,
            company.situacao,
              "SITUACAO");
      populateMapByChartName(
            { filter: company.situacao == 'ATIVA' && !!company.inscricaoMunicipal }, 
            company.responsavelPrefeitura, 
            "RESP PREFEITURA", 
            "Sem responsável");
      populateMapByChartName(
            { filter: company.situacao == 'ATIVA' && !!company.inscricaoEstadual }, 
            company.responsavelSefaz,
            "RESP ESTADO",
            "Sem responsável");
      populateMapByChartName(
            { filter: company.situacao == 'ATIVA' }, 
            company.uf,
            "ESTADOS");
      populateMapByChartName(
          { filter: company.situacao == 'ATIVA' }, 
          company.porte,
          "PORTE");
    }
    return data;

    function populateMapByChartName(chartFilter: ChartFilter | null, field: string | null, chartName: string, nullLabel: string = "N/D") {
      if(chartFilter && !chartFilter.filter) return;
      const fieldContent: string = (field ? field : nullLabel).toUpperCase();

      if(data.get(chartName)?.has(fieldContent)) {
        const currentValue = data.get(chartName)?.get(fieldContent);
        data.get(chartName)?.set(fieldContent, currentValue ? currentValue + 1 : 1);
      } else {
        data.get(chartName)?.set(fieldContent, 1);
      }
    }
  }
}

