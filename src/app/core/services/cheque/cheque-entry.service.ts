import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import {
    DynamicTable,
    DynamicTableQueryParameters,
} from 'mh-prime-dynamic-table';
import { ChequeList, NewChequeEntry } from '../../models/cheque';

@Injectable({
    providedIn: 'root',
})
export class ChequeEntryService {
    constructor(
        private http: HttpClient,
        private toastService: ToastService
    ) {}

    getCheques(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<DynamicTable<ChequeList>>> {
        return this.http
            .patch<
                IapiResponce<DynamicTable<ChequeList>>
            >('v1/Cheque/all-cheques', queryParameters)
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    insertNewChequeEntry(paylod: NewChequeEntry): Observable<IapiResponce> {
        return this.http
            .post<IapiResponce>('v1/Cheque/new-cheque-entry', paylod)
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
}
