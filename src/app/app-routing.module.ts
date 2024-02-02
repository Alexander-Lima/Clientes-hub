import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './general-vision-module/companies-list/companies-list.component';
import { ChartsComponent } from './charts-module/charts/charts.component';
import { RegisterComponent } from './register-module/register/register.component';


const routes: Routes = [
  {path: 'general-vision', component: CompaniesListComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'charts', component: ChartsComponent},
  {path: '', redirectTo: '/general-vision', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
