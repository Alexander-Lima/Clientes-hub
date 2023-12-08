import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../interfaces/company';
import { Observable, ObservableInput, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly URL: string = "http://192.168.1.203:8080/api/companies";

  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse): ObservableInput<any>{
    console.log(error);
    return error.message;
  }

  getCompanies(): Observable<Company[]>{
    return this.httpClient
              .get<Company[]>(this.URL)
              .pipe(retry(2), catchError(this.handleError));
  }
}
