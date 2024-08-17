import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { PensionBankAccounts } from '../../models/pension-bank-accounts';


@Injectable({
  providedIn: 'root'
})
export class PensionBankAccountsService {

  constructor(private http: HttpClient, private toastService: ToastService) { }


  addPensionBankAccounts(ppoId:number, dto: PensionBankAccounts):Observable<IapiResponce<PensionBankAccounts>>{
    return this.http.post<IapiResponce>('v1/ppo/'+ ppoId + '/bank-accounts', dto).pipe(
      catchError((error)=>{
        throw this.toastService.showError(error.message)
      })
    )
  }

  updatePensionBankAccounts(ppoId: number, dto: PensionBankAccounts):Observable<IapiResponce<PensionBankAccounts>>{
    return this.http.put<IapiResponce<PensionBankAccounts>>('v1/ppo/'+ ppoId + '/bank-accounts', dto).pipe(
      catchError((error)=>{
        throw this.toastService.showError(error.message)
      })
    )
  }

  getPensionBankAccounts(ppoId: number):Observable<IapiResponce<PensionBankAccounts>>{
    return this.http.get<IapiResponce<PensionBankAccounts>>('v1/ppo/'+ ppoId + '/bank-accounts').pipe(
      catchError((error)=>{
        throw this.toastService.showError(error.message)
      })
    )
  }
}
