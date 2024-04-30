import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';

@Injectable({
  providedIn: 'root'
})
export class ChequeInvoiceService {

  constructor(private http: HttpClient, private toastService: ToastService) { }
  frowardChequeInvoice(invoiceId: number): Observable<IapiResponce> {
    return this.http
      .put<IapiResponce>('v1/Cheque/cheque-invoice-froward', { invoiceId })
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }
}
