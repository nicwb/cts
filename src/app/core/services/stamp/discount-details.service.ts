import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { AddStampDiscountDetails, GetStampDiscountDetails } from '../../models/stamp';
import { Observable, catchError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})


export class DiscountDetailsService {

    constructor(private http: HttpClient, private toastService: ToastService) { }
    getStampDiscountDetailsList(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<GetStampDiscountDetails>> {
        return this.http
            .patch<IapiResponce<GetStampDiscountDetails>>(
                'v1/StampMaster/StampDiscountDetailsList',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }


    addNewStampDiscountDetail(payload: AddStampDiscountDetails): Observable<IapiResponce> {
        return this.http.post<IapiResponce>('v1/StampMaster/CreateStampDiscountDetails', payload).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }

    // TODO
    deleteStampDiscountDetail(id: Number): Observable<IapiResponce> {
        return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampDiscountDetailById?id='+ id).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }

}
