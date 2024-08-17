import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, throwError } from 'rxjs';
import { log } from 'console';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root' 
})

export class FirstPensionService {

  apiUrl = "v1/ppo/pension-bill";


  constructor(private http: HttpClient, private toastService: ToastService) {}
  
  getAll(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce> {
    return this.http
      .patch<IapiResponce>(
        this.apiUrl,
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }


  searchAll(queryParameters: DynamicTableQueryParameters): Observable<IapiResponce<DynamicTable<any>>> {
    return this.http
      .patch<IapiResponce<DynamicTable<any>>>(
        'v1/ppo/details',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          this.toastService.showError(error.message);
          return throwError(error);
        })
      );
  }

  generatePdf(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(this.apiUrl, payload, { headers, responseType: 'json' }).pipe(
      catchError((error) => {
        this.toastService.showError(error.message);
        return throwError(error);
      })
    );
  }

}
