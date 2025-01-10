import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../toast.service';
import {
    DynamicTable,
    DynamicTableQueryParameters,
} from 'mh-prime-dynamic-table';
import { Observable, throwError } from 'rxjs';

import { log } from 'console';
import { map, catchError } from 'rxjs/operators';
import { manualPpoReceiptEntryDTO } from '../../models/manual-ppo-receipt';
import { IapiResponce } from '../../models/iapi-responce';
import { PrimaryCategoryDetails } from '../../models/primary-category-details';

@Injectable({
    providedIn: 'root',
})
export class PrimaryCategoryDetailsService {
    apiUrl = 'v1/pension/primary-category';

    constructor(
        private http: HttpClient,
        private toastService: ToastService
    ) {}

    get_all_primary_details(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce> {
        return this.http
            .patch<IapiResponce>('v1/pension/primary-category', queryParameters)
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    //Add New Primary Category
    add_new_primary_details(
        dto: PrimaryCategoryDetails
    ): Observable<IapiResponce> {
        const payload = {
            hoaId: '2071-01-109-00-001-V-04-00',
            PrimaryCategoryName: 'Defence Pension',
        };
        return this.http
            .post<IapiResponce>('v1/pension/primary-category', dto)
            .pipe(
                catchError((error) => {
                    this.toastService.showError(error.message);
                    throw error;
                })
            );
    }
}
