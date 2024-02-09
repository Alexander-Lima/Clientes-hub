import { Injectable } from '@angular/core';
import xlsx, { IContent } from 'json-as-xlsx';
import { Company } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  private formatDateAndHours(date: string | null): string {
    if(!date) return "";
    const DATE_SUBSTRING = date.toString().substring(0, 19);
    const DATE_ARRAY = DATE_SUBSTRING.split(" ");
    const FORMATTED_DATE = 
      `${DATE_ARRAY[0].substring(8, 10)}/${DATE_ARRAY[0].substring(5, 7)}/${DATE_ARRAY[0].substring(0, 4)}`;
    const FORMATTED_HOURS = DATE_ARRAY[1];
    return `${FORMATTED_DATE} às ${FORMATTED_HOURS}`
  }

  public createExcelFile(companies: Company[]) {
    const data = [
      {
        sheet: "Clientes",
        columns: [
          { label: "CPF/CNPJ", value: "codigo" },
          { label: "NOME", value: "razaoSocial" },
          { label: "SITUAÇÃO", value: "situacao" },
          { label: "NATUREZA JURÍDICA", value: "naturezaJuridica" },
          { label: "REGIME", value: "regimeApuracao" },
          { label: "PORTE", value: "porte" },
          { label: "ATIV. PRINCIPAL", value: "atividadePrincipal" },
          { label: "ENDEREÇO", value: "endereco" },
          { label: "MUNICÍPIO", value: "municipio" },
          { label: "ESTADO", value: "uf" },
          { label: "ATUALIZAÇÃO (CLIENTE)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "INSC. MUNICIPAL", value: "inscricaoMunicipal" },
          { label: "CCP", value: "ccp" },
          { label: "RESP. PREFEITURA", value: "responsavelPrefeitura" },
          { label: "ATUALIZAÇÃO (PREFEITURA)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "INSC. ESTADUAL", value: "inscricaoEstadual" },
          { label: "RESP. SEFAZ", value: "responsavelSefaz" },
          { label: "ATUALIZAÇÃO (SEFAZ)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "FONTE", value: "dataSource" },
          { label: "ERRO", value: "errorMessage" }
        ],
        content: <IContent[]>[]
      }
    ]
 
    const settings = {
      fileName: "Dados clientes",
      writeMode: "writeFile"
    }
    
    for(let company of companies) {
      let row: IContent = {};
      for(let key of Object.keys(company)) {
        row[key] = company[key as keyof Company];
      }
      data[0].content.push(row);
    }
    xlsx(data, settings);
  }
}
