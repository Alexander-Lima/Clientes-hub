import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company } from '../interfaces/company';

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
    ['TODOS', 'CNPJ/CPF', 'NOME', 'ATIVIDADE PRINCIPAL', 'ENDEREÇO', 'REGIME',
    'ESTADO - RESPONSÁVEL', 'ESTADO - INSCRIÇÃO', 'SITUAÇÃO',
    'MUNICÍPIO - INSCRIÇÃO', 'MUNICÍPIO - RESPONSÁVEL', 'MUNICÍPIO - CCP'];
    

  applyFilter(input: HTMLInputElement) {
    const SEARCH_TERM = input.value;
    if(!SEARCH_TERM && !this.searchEmpty) {
      return this.resetFilter();
    }
    const OPTION = this.getCompanyProperty();
    this.formatInput(input);
 
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

  formatInput(input: HTMLInputElement) {
    input.value = input.value
                    .replaceAll(".", "")
                    .replaceAll("/", "")
                    .replaceAll("-", "");
  }

  getCompanyProperty(): string | null{
    const CompanyMap = {
      'TODOS' : null,
      'CNPJ/CPF': 'codigo',
      'NOME' : 'razaoSocial',
      'ENDEREÇO' : 'endereco',
      'ATIVIDADE PRINCIPAL' : 'atividadePrincipal',
      'REGIME' : 'regimeApuracao',
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
}
