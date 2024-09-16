import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Observable, catchError } from 'rxjs';
import { GetStampTypes, AddStampType } from '../../models/stamp';
import { IapiResponce } from '../../models/iapi-responce';
import { ToastService } from '../toast.service';

@Injectable({
    providedIn: 'root'
})
export class TypeService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    getStampTypeList(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<GetStampTypes>> {
        return this.http
            .patch<IapiResponce<GetStampTypes>>(
                'v1/StampMaster/StampTypeList',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    addNewStampType(paylod: AddStampType): Observable<IapiResponce> {
        return this.http.post<IapiResponce>('v1/StampMaster/CreateStampType', paylod).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }

    deleteStampType(id: Number): Observable<IapiResponce> {
        return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampTypesById?id='+id).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
}

