import { Injectable } from '@angular/core';
import {  Component_interface } from '../../models/component';
import { IapiResponce } from '../../models/iapi-responce'
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../toast.service';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Observable, throwError } from 'rxjs';

import { log } from 'console';
import { map, catchError } from 'rxjs/operators';



@Injectable({ 
  providedIn: 'root'
})
export class ComponentService {

    apiUrl = "v1/pension/component";
    //apiUrl = "v1/echo";


    constructor(private http: HttpClient, private toastService: ToastService) {}

    get_all_component_details(
      queryParameters: DynamicTableQueryParameters
    ): Observable<IapiResponce> {
      return this.http
        .patch<IapiResponce>(
          'v1/pension/component',
          queryParameters
        )
        .pipe(
          catchError((error) => {
            throw this.toastService.showError(error.message);
          })
        );
    }

    //Get Component Details 
    GetAllComponentDetails(id: string): Observable<IapiResponce<Component_interface>> {
      return this.http.get<IapiResponce<Component_interface>>('v1/pension/component/' + id).pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
    }

    //Add New Component Details
    add_new_component_details(dto: Component_interface): Observable<IapiResponce<Component_interface>> {
      return this.http.post<IapiResponce<Component_interface>>('v1/pension/component', dto).pipe(
        catchError((error) => {
          this.toastService.showError(error.message);
          throw error;
        })
      );
    }

    //Update Component Details
    updateComponentDetails(id: string, dto: Component_interface): Observable<IapiResponce> {
      return this.http.put<IapiResponce>(`v1/pension/component/${id}`, dto).pipe(
        catchError((error) => {
          this.toastService.showError(error.message);
          return throwError(error);
        })
      );
    }

}