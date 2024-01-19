import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

  constructor(private httpClient: HttpClient) { }

  public recordClient(clientCode: string) {
    const URL = `http://192.168.1.203:80/hub-clientes/clients-api/${clientCode}`;
    return this.httpClient.post<string>(URL, null,{observe: 'response'});
  }
}


