import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { AddStampLabel, GetStampLabels } from '../../models/stamp';
import { Observable, catchError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LabelService {

    constructor(private http: HttpClient, private toastService: ToastService) { }


    getStampLabelList(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<GetStampLabels>> {
        return this.http
            .patch<IapiResponce<GetStampLabels>>(
                'v1/StampMaster/StampLabelList',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    addNewStampLabel(payload: AddStampLabel): Observable<IapiResponce> {
        return this.http.post<IapiResponce>('v1/StampMaster/CreateStampLabel', payload).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
    deleteStampLabel(id: Number): Observable<IapiResponce> {
        return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampLabelsById?id='+ id).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
}
