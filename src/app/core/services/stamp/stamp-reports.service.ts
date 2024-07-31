import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StampReportsService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  getEC136(params: any): Observable<IapiResponce<any>> {
    return this.http.get<IapiResponce<any>>(`v1/StampReport/EC136?start_date_string=${params.fromDate}&end_date_string=${params.toDate}`).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  getEC137(params: any): Observable<IapiResponce<any>> {
    return this.http.get<IapiResponce<any>>(`v1/StampReport/EC137?start_date_string=${params.fromDate}&end_date_string=${params.toDate}`).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

}
