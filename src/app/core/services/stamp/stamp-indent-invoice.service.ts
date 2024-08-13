import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, catchError } from 'rxjs';
import { AddStampIndent, AddStampInvoice, GetStampIndents, GetStampInvoices } from '../../models/stamp';
@Injectable({
  providedIn: 'root'
})
export class StampIndentInvoiceService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  // Stamp Indent
  getAllStampIndents(
    queryParameters: DynamicTableQueryParameters,
    dates: any
  ): Observable<IapiResponce<GetStampIndents>> {
    return this.http
      .patch<IapiResponce<GetStampIndents>>(
        `v1/Stamp/StampIndentList?startDate=${dates.fromDate}&endDate=${dates.toDate}`,
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }
  getAllStampIndentsProcessing(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampIndents>> {
    return this.http
      .patch<IapiResponce<GetStampIndents>>(
        'v1/Stamp/StampIndentListProcessing',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }
  getAllStampIndentsProcessed(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampIndents>> {
    return this.http
      .patch<IapiResponce<GetStampIndents>>(
        'v1/Stamp/StampIndentListProcessed',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampIndent(payload: AddStampIndent): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/Stamp/CreateStampIndent', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
  getStampIndentDetails(id: number, queryParameters: DynamicTableQueryParameters): Observable<IapiResponce<GetStampIndents>> {
    return this.http.patch<IapiResponce<GetStampIndents>>(`v1/Stamp/IndentDetailsById?id=${id}`, queryParameters).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  receiveIndent(payload: AddStampInvoice): Observable<IapiResponce<boolean>> {
    return this.http.post<IapiResponce<boolean>>(`v1/Stamp/ReceiveStampIndent`, payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  rejectIndentByIndentId(id: number): Observable<IapiResponce<boolean>> {
    return this.http.get<IapiResponce<boolean>>(`v1/Stamp/RejectStampIndent?stampIndentId=${id}`).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message)
      })
    )
  }

  // Stamp Invoice
  getAllStampInvoice(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampInvoices>> {
    return this.http
      .patch<IapiResponce<GetStampInvoices>>(
        'v1/Stamp/StampInvoiceList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampInvoice(payload: AddStampInvoice): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/Stamp/CreateStampInvoice', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
}
