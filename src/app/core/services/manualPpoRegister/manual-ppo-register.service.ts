import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ManualPpoRegisterService {

    constructor(private http: HttpClient, private toastservice: ToastService) { }

  
    generateManualPpoRegister(data: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
        return this.http
            .post<any>(
                'v1/echo', data, { headers }
            )
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }

  
}
