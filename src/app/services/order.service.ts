import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _uri = "http://localhost:3600/routing";
    constructor(private http: HttpClient) { }

    addItem(itemsData){
    	return this.http.post<any>(`${this._uri}/addItem`, itemsData)
    }
}
