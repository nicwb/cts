import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { error } from 'console';


@Injectable({
    providedIn: 'root'
})
export class PaymandateService {

    constructor(private http: HttpClient, private toastservice: ToastService) { }

    getPaymandateShortlist(): Observable<IapiResponce> {
        return this.http.get<IapiResponce>('v1/PayMandate/Sortlist').pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        );
    }

    saveNewPaymandateShortlist(payload:any):Observable<IapiResponce>{
        return this.http.post<IapiResponce>('v1/PayMandate/newShortList', payload).pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        )
    }
}
