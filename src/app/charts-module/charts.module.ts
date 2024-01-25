import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts/charts.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    ChartsComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports: [ChartsComponent]
})
export class ChartsModule { }
