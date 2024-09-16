import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { PPOEntryINF } from '../../models/ppoentry-inf';
import { IapiResponce } from '../../models/iapi-responce';
import { catchError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PpoDetailsService {
    constructor(
    private http: HttpClient,
    private toastService: ToastService
    ) { }

    /// add a new recode
    CreatePPODetails(
        queryParameters: PPOEntryINF
    ): Observable<IapiResponce> {
        const apiUrl = "v1/ppo/details";

        return this.http
            .post<IapiResponce>(
                apiUrl,
                queryParameters
            )
            .pipe(
                catchError((error) => {
                    throw error;
                })
            );
    }
}
