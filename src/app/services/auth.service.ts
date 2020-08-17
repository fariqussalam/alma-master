import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { FormGroup, FormControl, Validators } from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

private _uri = "http://localhost:3600/routing";
  constructor(private http: HttpClient) { }

  loginUser(userData){
  	return this.http.post<any>(`${this._uri}/login`, userData)
  }

  loggedIn(){
  	return !!localStorage.getItem('token')
  }

}
