import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) { }

  public recordClient(clientCode: string) {
    const URL = `http://192.168.1.203:80/hub-clientes/clients-api/${clientCode}`;
    return this.httpClient.post<string>(URL, null,{observe: 'response'});
  }

  public deleteClient(clientCode: string) {
    const URL = `http://192.168.1.203:80/hub-clientes/clients-api/${clientCode}`;
    return this.httpClient.delete<string>(URL);
  }
}


