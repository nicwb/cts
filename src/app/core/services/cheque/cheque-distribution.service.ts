import { Injectable } from '@angular/core';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { chequeDistributionList } from '../../models/cheque';

@Injectable({
    providedIn: 'root'
})
export class ChequeDistributionService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    getChqueListForDistribution(queryParameters: DynamicTableQueryParameters): Observable<IapiResponce<DynamicTable<chequeDistributionList>>> {
        return this.http
            .patch<IapiResponce<DynamicTable<chequeDistributionList>>>(
                'v1/Cheque/cheque-received-list',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    getUserList(): Observable<IapiResponce> {
        return this.http.get<IapiResponce>('v1/Cheque/user-list').pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }

    getReceivedList():Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/Cheque/getChequeReceivedDetails').pipe(
            catchError((error)=>{
                throw this.toastService.showError(error.message);
            })
        );
    }

    saveChequeDistribution(data: any): Observable<IapiResponce> {
        return this.http
            .post<IapiResponce>('v1/Cheque/save-Cheque-Distribution', data)
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
}
