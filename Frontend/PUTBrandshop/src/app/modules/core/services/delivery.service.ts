import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetDelivery } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  apiUrl = `${environment.apiUrl}/deliver`;

  constructor(private http: HttpClient) {}

  getDelivery(): Observable<GetDelivery[]> {
    return this.http.get<GetDelivery[]>(`${this.apiUrl}`);
  }
}
