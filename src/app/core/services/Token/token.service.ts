import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, retry } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { GeneratedToken, tokenDetails, tokenPrint } from '../../models/token';
import {
    DynamicTable,
    DynamicTableQueryParameters,
} from '../../models/dynamic-table';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    selectedId: Number | any;
    selectedTokenNo: Number | any;
    selectedTokenDate: Date | undefined;
    selectedTokenRef: number | any;
    private actionButtonClickSubject = new Subject<void>();
    showModal: boolean = false;
    constructor(
        private http: HttpClient,
        private toastservice: ToastService
    ) {}
    //=======================================
    actionButtonClicked() {
        this.actionButtonClickSubject.next();
    }

    getActionButtonObservable() {
        return this.actionButtonClickSubject.asObservable();
    }
    //=======================================

    getAllToken(): Observable<IapiResponce> {
        return this.http.get<IapiResponce>('v1/Token/GetAllTokens').pipe(
            catchError((error) => {
                throw this.toastservice.showError(error.message);
            })
        );
    }
    // getTokens(path:string): Observable<IapiResponce<DynamicList<tokenDetails>>> {
    //     return this.http.get<IapiResponce<DynamicList<tokenDetails>>>('v1/'+path).pipe(
    //         catchError((error) => {
    //             throw this.toastservice.showError(error.message);
    //         })
    //     );
    // }
    getTokens(
        path: string,
        queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce<DynamicTable<tokenDetails>>> {
        return this.http
            .post<
                IapiResponce<DynamicTable<tokenDetails>>
            >('v1/' + path, queryParameters)
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }
    generateToken(payload: any): Observable<IapiResponce<GeneratedToken>> {
        return this.http
            .post<IapiResponce>('v1/token/GenerateToken', payload)
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }
    getPrintDetails(tokenId: number): Observable<IapiResponce<tokenPrint>> {
        return this.http
            .get<IapiResponce<tokenPrint>>('v1/Token/TokenPrint/' + tokenId)
            .pipe(
                catchError((error) => {
                    throw this.toastservice.showError(error.message);
                })
            );
    }
}
