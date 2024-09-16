import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { chequeIndent, ChequeIndentDeatil, ChequeIndentList, IndentInvoiceDetails } from '../../models/cheque';
import { DynamicTable, DynamicTableQueryParameters } from '../../models/dynamic-table';
import { error } from 'console';


@Injectable({
    providedIn: 'root'
})
export class ChequeIndentService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    chqueIndentEntry(payload: chequeIndent): Observable<IapiResponce> {
        return this.http.post<IapiResponce>('v1/Cheque/cheque-indent', payload).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
    getChqueIndentList(queryParameters: DynamicTableQueryParameters): Observable<IapiResponce<DynamicTable<ChequeIndentList>>> {
        return this.http
            .patch<IapiResponce<DynamicTable<ChequeIndentList>>>(
                'v1/Cheque/cheque-indent-list',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    getChqueInvoiceList(queryParameters: DynamicTableQueryParameters): Observable<IapiResponce<DynamicTable<ChequeIndentList>>> {
        return this.http
            .patch<IapiResponce<DynamicTable<ChequeIndentList>>>(
                'v1/Cheque/cheque-invoice-list',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    frowardChequeIndent(indentId: number): Observable<IapiResponce> {
        return this.http
            .put<IapiResponce>('v1/Cheque/cheque-indent-froward', { indentId })
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    approveChequeIndent(indentId: number): Observable<IapiResponce> {
        return this.http
            .put<IapiResponce>('v1/Cheque/cheque-indent-approve', { indentId })
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    rejectChequeIndent(indentId: number): Observable<IapiResponce> {
        return this.http
            .put<IapiResponce>('v1/Cheque/cheque-indent-reject', { indentId })
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    indentDetailsById(indentId: number): Observable<IapiResponce> {
        return this.http.get<IapiResponce>('v1/Cheque/cheque-indent/?Id=' + indentId)
            .pipe(catchError((error) => {
                throw this.toastService.showError(error.message)
            })
            );
    }

    getSeriesList(): Observable<IapiResponce> {
        return this.http.get<IapiResponce>('v1/Cheque/series').pipe(catchError((error) => {
            throw this.toastService.showError(error.message)
        })
        );
    }

    getSeriesDetails(code: number) {
        return this.http.get<IapiResponce>('v1/Cheque/series-details?Id=' + code).pipe(catchError((error) => {
            throw this.toastService.showError(error.message);
        }));
    }

    saveChequeIndentInvoice(payload:IndentInvoiceDetails){
        return this.http.post<IapiResponce>('v1/Cheque/new-cheque-invoice',payload).pipe(catchError((error)=>{
            throw this.toastService.showError(error.message);
        }));
    }
}
