import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { ChequeReceive } from '../../models/cheque';
import { IapiResponce } from '../../models/iapi-responce';
import { catchError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChequeReceiveService {

    constructor(private http: HttpClient, private toastService: ToastService) { }

    saveChequeReceive(payload:ChequeReceive){
        return this.http.post<IapiResponce>('v1/Cheque/cheque-received',payload).pipe(catchError((error)=>{
            throw this.toastService.showError(error.message);
        }));
    }
}
