import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { catchError, Observable } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';

@Injectable({
  providedIn: 'root'
})
export class BillPrintService {

  constructor(private http: HttpClient, private toastservice: ToastService) { }

  
  getBillPrint(ppoId: number): Observable<IapiResponce> {
    
    return this.http
        .get<IapiResponce>(
            'v1/ppo/'+ ppoId+ '/first-bill-general'
        )
        .pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        );
  }

  patchBillPrint(data: string): Observable<IapiResponce> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http
        .patch<IapiResponce>(
            'v1/ppo/pension-bill', data, { headers }
        )
        .pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        );
  }

}
