import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { FilterComponent } from './filter/filter.component'
import { UpperCasePipe, DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CompaniesListComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UpperCasePipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
