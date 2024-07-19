import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, catchError } from 'rxjs';
import { StampWalletRefill, StampWalletGet } from '../../models/stamp';

@Injectable({
  providedIn: 'root'
})
export class StampWalletService {

  constructor(private http: HttpClient, private toastService: ToastService) { }


  getStampWalletBalanceByTreasuryCodeAndCombinationId(
    payload: any
  ): Observable<IapiResponce<StampWalletGet>> {
    return this.http
      .get<IapiResponce<StampWalletGet>>(
        `v1/StampWallet/getStampWalletBalanceByTreasuryCode?treasuryCode=${payload.treasuryCode}&combinationId=${payload.combinationId}`        
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  createOrUpdateStampWallet(payload: StampWalletRefill): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampWallet/CreateOrUpdateStampWallet', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
}
