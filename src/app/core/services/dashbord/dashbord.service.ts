import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { error } from 'console';

@Injectable({
    providedIn: 'root'
})
export class DashbordService {

    constructor(private http: HttpClient,private toastService:ToastService) { }

    getBillsCountByStatus(status:number): Observable<IapiResponce> {
        return this.http
            .get<IapiResponce>('v1/Bill/GetNumberOfBills/'+status)
            .pipe(
                catchError((error) => {
                    if(error.status){
                        throw this.toastService.showError(error.message);
                    }
                    throw this.toastService.showError('Server Down!');
                }),
            );
    }

    getNoOfToken(): Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/Dashboard/count')
            .pipe(catchError((error) => {
                if(error.status){
                    throw this.toastService.showError(error.message);
                }
                throw this.toastService.showError('Server Down!');
            }),
            );
    }
}
