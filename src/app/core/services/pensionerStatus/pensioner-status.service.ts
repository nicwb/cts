import { Injectable } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { pensionerStatusDTO } from '../../models/pensioner-status';


@Injectable({
    providedIn: 'root'
})

@Injectable({
    providedIn: 'root'
})
export class PensionerStatusService {

    constructor(private http: HttpClient, private toastservice: ToastService) { }

    addStatus(pensionerStatus: pensionerStatusDTO): Observable<IapiResponce> {
    
        return this.http
            .post<IapiResponce>('v1/ppo/status', pensionerStatus)
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }
    getStatus(ppoId: number, statusFlag: number): Observable<IapiResponce<pensionerStatusDTO>> {
        return this.http
            .get<IapiResponce<pensionerStatusDTO>>(
                'v1/ppo/' + ppoId + '/status/' + statusFlag
            )
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }

    deleteStatus(ppoId: number, statusFlag: number): Observable<IapiResponce> {
        return this.http.delete<IapiResponce>('v1/ppo/' + ppoId + '/status/' + statusFlag).pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        );
    }




}
