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

  getEC(params: any, ECNumber: string): Observable<IapiResponce<any>> {
    return this.http.get<IapiResponce<any>>(`v1/StampReport/${ECNumber}?start_date_string=${params.fromDate}&end_date_string=${params.toDate}`).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
}
