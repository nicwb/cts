import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { ChequeList } from '../../models/cheque';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor(private http: HttpClient, private toastService: ToastService) { }


    getBankList(): Observable<IapiResponce> {
        return this.http.get<IapiResponce>("v1/Bank/get-banks").pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }

    getBankBranches(bankCode:number):Observable<IapiResponce>{
        return this.http.get<IapiResponce>("v1/Bank/get-bank-branchs?bankCode="+ bankCode).pipe(
            catchError((error)=>{
                throw this.toastService.showError(error.message)
            })
        )
    }

    getBranchDetail(branchCode:number):Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/Bank/get-branch?branchCode='+ branchCode).pipe(
            catchError((error)=>{
                throw this.toastService.showError(error.message)
            })
        )
    }

}
