import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { FilterComponent } from './filter/filter.component';
import { IsblankPipe } from './pipes/isblank.pipe';
import { FormatcodePipe } from './pipes/formatcode.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormatcodePipe,
    IsblankPipe,
    FilterComponent,
    CompaniesListComponent
  ],
  imports: [
    CommonModule,
    UpperCasePipe,
    DatePipe,
    FormsModule,      
  ],
  exports: [CompaniesListComponent]
})
export class GeneralVisionModule { }
