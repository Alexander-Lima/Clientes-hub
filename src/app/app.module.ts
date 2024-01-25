import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { GeneralVisionModule } from './general-vision-module/general-vision.module';
import { ChartsModule } from './charts-module/charts.module';
import { RegisterModule } from './register-module/register.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GeneralVisionModule,
    HttpClientModule,
    ChartsModule,
    RegisterModule,
    NgChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
