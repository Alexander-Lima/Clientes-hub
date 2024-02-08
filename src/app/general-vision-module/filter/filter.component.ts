import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../interfaces/company';
import xlsx, { IContent } from 'json-as-xlsx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent {
  @Input() companies!: Company[];
  @Output() hasFilterResults = new EventEmitter();
  @Input() filterCount!: number;
  searchEmpty: boolean = false;
  selectedOption = 'TODOS';
  companyOptions: string[] = 
    ['TODOS', 'CNPJ/CPF', 'NOME', 'ATIVIDADE PRINCIPAL', 'NATUREZA JURÍDICA','PORTE', 'ENDEREÇO', 'REGIME',
    'SITUAÇÃO', 'ESTADO - RESPONSÁVEL', 'ESTADO - INSCRIÇÃO', 
    'MUNICÍPIO - INSCRIÇÃO', 'MUNICÍPIO - RESPONSÁVEL', 'MUNICÍPIO - CCP'];
    

  applyFilter(input: HTMLInputElement) {
    const SEARCH_TERM = this.formatSearchTerm(input.value);
    if(!SEARCH_TERM && !this.searchEmpty) {
      return this.resetFilter();
    }
    const OPTION = this.getCompanyProperty();
 
    for(let company of this.companies) {
      company.show = 
        OPTION ? this.fieldContains(company, OPTION, SEARCH_TERM) :
                 this.objectContains(company, SEARCH_TERM);
    }
    this.updateFilterCount();
    this.hasFilterResults.emit(this.hasResults());
  }
  
  resetFilter() {
    if(this.companies.length > 0) {
      this.hasFilterResults.emit(true);
      this.selectedOption = 'TODOS'
      this.companies.forEach(company => company.show = true);
      this.filterCount = this.companies.length
    }
  }

  onKeyPress(event: KeyboardEvent, input: HTMLInputElement) {
    if(event.key == "Enter") {
      this.applyFilter(input); 
    }
  }

  formatSearchTerm(searchTerm: string): string {
    return searchTerm.replaceAll(".", "")
                    .replaceAll("/", "")
                    .replaceAll("-", "");
  }

  getCompanyProperty(): string | null{
    const CompanyMap = {
      'TODOS' : null,
      'CNPJ/CPF': 'codigo',
      'NOME' : 'razaoSocial',
      'ATIVIDADE PRINCIPAL' : 'atividadePrincipal',
      'ENDEREÇO' : 'endereco',
      'PORTE' : 'porte',
      'REGIME' : 'regimeApuracao',
      'NATUREZA JURÍDICA' : 'naturezaJuridica',
      'SITUAÇÃO' : 'situacao',
      'ESTADO - INSCRIÇÃO' : 'inscricaoEstadual',
      'ESTADO - RESPONSÁVEL' : 'responsavelSefaz',
      'MUNICÍPIO - INSCRIÇÃO' : 'inscricaoMunicipal',
      'MUNICÍPIO - RESPONSÁVEL' : 'responsavelPrefeitura',
      'MUNICÍPIO - CCP' : 'ccp'
    }
    return CompanyMap[this.selectedOption as keyof typeof CompanyMap];
  }

  includesString(ObjectValue: string | undefined, text: string): boolean {
    if(!this.searchEmpty) {
      if(!ObjectValue) return false;
      return ObjectValue.toString().toUpperCase().includes(text.toUpperCase()) 
    }
    return !ObjectValue;
  }

  fieldContains(company: Company, option: string, value: string): boolean {
    return this.includesString(company[option as keyof Company]?.toString(), value)
  }

  objectContains(company: Company, text: string): boolean {
    for(let value of Object.values(company)) {
      if(this.includesString(value, text)) return true;
    }
    return false;
  }

  hasResults(): boolean {
    return this.companies.some(company => company.show);
  }

  updateFilterCount() {
    this.filterCount = this.companies.filter(company => company.show).length;
  }

  getResultCountText(): string {
    switch (this.filterCount) {
      case 0:
        return ''
      case 1:
        return 'resultado encontrado'
      default:
        return 'resultados encontrados'
    }
  }

  checkboxOnChange(input: HTMLInputElement) {
    this.searchEmpty = !this.searchEmpty;
    this.selectedOption = 'CNPJ/CPF'
    input.value = "";
  }

  formatDateAndHours(date: string | null): string {
    if(!date) return "";
    const DATE_SUBSTRING = date.toString().substring(0, 19);
    const DATE_ARRAY = DATE_SUBSTRING.split(" ");
    const FORMATTED_DATE = 
      `${DATE_ARRAY[0].substring(8, 10)}/${DATE_ARRAY[0].substring(5, 7)}/${DATE_ARRAY[0].substring(0, 4)}`;
    const FORMATTED_HOURS = DATE_ARRAY[1];
    return `${FORMATTED_DATE} às ${FORMATTED_HOURS}`
  }

  createExcelFile() {
    const data = [
      {
        sheet: "Clientes",
        columns: [
          { label: "CPF/CNPJ", value: "codigo" },
          { label: "NOME", value: "razaoSocial" },
          { label: "ENDEREÇO", value: "endereco" },
          { label: "ATIV. PRINCIPAL", value: "atividadePrincipal" },
          { label: "REGIME", value: "regimeApuracao" },
          { label: "SITUAÇÃO", value: "situacao" },
          { label: "FONTE", value: "dataSource" },
          { label: "ATUALIZAÇÃO (CLIENTE)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "INSC. MUNICIPAL", value: "inscricaoMunicipal" },
          { label: "CCP", value: "ccp" },
          { label: "RESP. PREFEITURA", value: "responsavelPrefeitura" },
          { label: "ATUALIZAÇÃO (PREFEITURA)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "INSC. ESTADUAL", value: "inscricaoEstadual" },
          { label: "RESP. SEFAZ", value: "responsavelSefaz" },
          { label: "ATUALIZAÇÃO (SEFAZ)", value: (row: any) => this.formatDateAndHours(row.lastUpdateClientes)},
          { label: "ERRO", value: "errorMessage" }
        ],
        content: <IContent[]>[]
      }
    ]
 
    const settings = {
      fileName: "Dados clientes",
      writeMode: "writeFile"
    }
    
    for(let company of this.companies) {
      let row: IContent = {};
      for(let key of Object.keys(company)) {
        row[key] = company[key as keyof Company];
      }
      data[0].content.push(row);
    }
    xlsx(data, settings);
  }
}
