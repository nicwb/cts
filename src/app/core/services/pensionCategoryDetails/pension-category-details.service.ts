import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Observable, throwError } from 'rxjs';

import { log } from 'console';
import { map, catchError } from 'rxjs/operators';
import { IapiResponce } from '../../models/iapi-responce';
import { PensionCategoryDetails } from 'src/app/core/models/pension-category-details';


@Injectable({
    providedIn: 'root'
})
export class PensionCategoryDetailsService {

    apiUrl = "v1/pension/category";


    constructor(private http: HttpClient, private toastService: ToastService) {}

    get_all_Pension_details(
        queryParameters : DynamicTableQueryParameters
    ): Observable<IapiResponce> {
        return this.http
            .patch<IapiResponce>(
                'v1/pension/category',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
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

    get_all_Sub_details(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce> {
        return this.http
            .patch<IapiResponce>('v1/pension/sub-category', queryParameters)
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }




    //Add New Pension Category
    add_new_Pension_details(dto: PensionCategoryDetails): Observable<IapiResponce<PensionCategoryDetails>> {
        return this.http.post<IapiResponce<PensionCategoryDetails>>('v1/pension/category', dto,
        ).pipe(
            catchError((error) => {
                throw  this.toastService.showError(error.message);

            })
        );
    }




}
