import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';

@Injectable({
    providedIn: 'root'
})
export class MasterService {

    constructor(private http: HttpClient, private toastservice: ToastService) { }
   
    getTreasuries():Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/Master/get-treasuries').pipe(
            catchError((error)=>{
                throw this.toastservice.showError(error.message);
            })
        )
    }
    getVendorTypes():Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/StampMaster/GetALLStampVendorTypes').pipe(
            catchError((error)=>{
                throw this.toastservice.showError(error.message);
            })
        )
    }
    getCategoryTypes():Observable<IapiResponce>{
        return this.http.get<IapiResponce>('v1/StampMaster/GetALLStampCategoryTypes').pipe(
            catchError((error)=>{
                throw this.toastservice.showError(error.message);
            })
        )
    }
}
