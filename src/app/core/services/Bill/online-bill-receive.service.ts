import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { error } from 'console';

@Injectable({
    providedIn: 'root'
})
export class OnlineBillReceiveService {
    selectedBillRefNo:number = 0;
    selectedBillId:number = 0;
    constructor(private http: HttpClient,private toastService:ToastService) { }
  
    getAllData(): Observable<IapiResponce>{
        return this.http
            .get<IapiResponce>('')
            .pipe(
     
            )
    }
    getBillDetailsByRef(refNo:number): Observable<IapiResponce> {
        return this.http
            .get<IapiResponce>('v1/Bill/GetRefBillDetails/'+refNo)
            .pipe(
                catchError((error) => {
                    if(error.status){
                        throw this.toastService.showError(error.message);
                    }
                    throw this.toastService.showError('Server Down!');
                }),
            );
    }
}


