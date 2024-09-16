import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { Observable, catchError } from 'rxjs';
import { IapiResponce } from '../models/iapi-responce';
import { IObjection, ISetNewObjection, TokenWithObjections } from '../models/objection';

@Injectable({
    providedIn: 'root'
})
export class ObjectionService {

    constructor(private http: HttpClient, private toastService: ToastService) {}
    getGobalObjection(): Observable<IapiResponce<IObjection>> {
        return this.http
            .get<IapiResponce<IObjection>>('v1/Objection/GetGobalObjections')
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    getLocalObjection(): Observable<IapiResponce<IObjection>> {
        return this.http
            .get<IapiResponce<IObjection>>('v1/Objection/GetLocalObjections')
            .pipe(
                catchError((error) => {
                    throw this.toastService.showError(error.message);
                })
            );
    }
    getTokenObjections(tokenId:number):Observable<IapiResponce<TokenWithObjections>>{
        return this.http.get<IapiResponce<TokenWithObjections>>('v1/Objection/GetTokenObjections/'+tokenId).pipe(catchError((error)=>{
            throw this.toastService.showError(error.message);
        }));
    }
    setNewLocalObjection(newData:ISetNewObjection):Observable<IapiResponce>{
        return this.http.put<IapiResponce>("v1/Objection/NewLocalObjection",newData).pipe(catchError((error) => {
            throw this.toastService.showError(error.message);
        }));
    }
}
