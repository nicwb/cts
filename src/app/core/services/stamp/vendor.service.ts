import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { GetStampVendors, AddStampVendors } from '../../models/stamp';
import { Observable, catchError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class VendorService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    getStampVendorList(
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<GetStampVendors>> {
        return this.http
            .patch<IapiResponce<GetStampVendors>>(
                'v1/StampMaster/StampVendorList',
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }

    addNewStampVendor(paylod: FormData): Observable<IapiResponce> {
        const headers = new HttpHeaders({
            'enctype': 'multipart/form-data'
        });
        return this.http.post<IapiResponce>('v1/StampMaster/CreateStampVendor', paylod, {headers}).pipe(
            catchError((error) => {
                console.log(error.message, error);
        
                throw this.toastService.showError(error.message);
            })
        );
    }
    deleteStampVendor(id: Number): Observable<IapiResponce> {
        return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampVendorsById?id='+ id).pipe(
            catchError((error) => {
                throw this.toastService.showError(error.message);
            })
        );
    }
}
// DeleteStampVendorsById