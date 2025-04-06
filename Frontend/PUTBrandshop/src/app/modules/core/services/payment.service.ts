import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetPayment } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  getPayment(): Observable<GetPayment[]> {
    return this.http.get<GetPayment[]>(`${this.apiUrl}`);
  }
}
