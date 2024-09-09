import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IIva } from '../Interfaces/iva';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IvaService {

  apiurl = 'http://localhost/eddy_trejo/proyecto/controllers/iva.controller.php?op=';

  constructor(private http : HttpClient) { }

  todos(): Observable<IIva[]> {
    return this.http.get<IIva[]>(this.apiurl + 'todos');
  }
  
}
