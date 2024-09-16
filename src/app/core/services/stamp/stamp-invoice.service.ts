import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, catchError } from 'rxjs';
import { AddStampInvoice, GetStampInvoices } from '../../models/stamp';
@Injectable({
    providedIn: 'root'
})
export class StampInvoiceService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    getAllStampInvoice(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<GetStampInvoices>> {
        return this.http
            .patch<IapiResponce<GetStampInvoices>>(
                'v1/Stamp/StampInvoiceList',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    addNewStampInvoice(payload: AddStampInvoice): Observable<IapiResponce> {
        return this.http.post<IapiResponce>('v1/Stamp/CreateStampInvoice', payload).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
}


