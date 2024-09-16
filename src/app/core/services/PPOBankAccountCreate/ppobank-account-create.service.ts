import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IapiResponce } from '../../models/iapi-responce';
import { CreatePensonarBankDTO } from '../../models/ppoentry-inf';
import { catchError, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PPOBankAccountCreateService {
    private apiurl = 'v1/ppo/';
    constructor(
    private http: HttpClient,
    ) { }

    createPensonarBankAccount(data:CreatePensonarBankDTO,ppoId:String): Observable<IapiResponce> {
        this.apiurl = this.apiurl + ppoId + "/bank-accounts";
        return this.http.post<IapiResponce>(this.apiurl,data).pipe(
            catchError((error) => {
                throw error;
            })
        )
    }
}
