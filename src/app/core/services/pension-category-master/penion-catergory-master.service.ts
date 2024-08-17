import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { catchError, Observable } from 'rxjs';
import { IapiResponce } from '../../models/iapi-responce';
import { PrimaryCategoryEntryDTO, PrimaryCategoryResponseDTO, SubCategoryEntryDTO,SubCategoryResponseDTO, CategoryEntryDTO, CategoryResponseDTO } from '../../models/pension-category-master';

@Injectable({
  providedIn: 'root'
})
export class PenionCatergoryMasterService {apiUrl = "v1/manual-ppo/receipts";


  constructor(private http: HttpClient, private toastService: ToastService) {}
  
  getAllPrimaryCategory(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<PrimaryCategoryResponseDTO>> {
    return this.http
      .patch<IapiResponce<PrimaryCategoryResponseDTO>>(
        'v1/pension/primary-category',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  getAllSubCategory(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<SubCategoryResponseDTO>> {
    return this.http
      .patch<IapiResponce<SubCategoryResponseDTO>>(
        'v1/pension/sub-category',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  getAllCategory(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<CategoryResponseDTO>> {
    return this.http
      .patch<IapiResponce<CategoryResponseDTO>>(
        'v1/pension/category',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }


  
  addPrimaryCategory(dto: PrimaryCategoryEntryDTO): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/pension/primary-category', dto).pipe(
      catchError((error) => {
        this.toastService.showError(error.message);
        throw error;
      }) 
    );
  }

  addSubCategory(dto: SubCategoryEntryDTO): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/pension/sub-category', dto).pipe(
      catchError((error) => {
        this.toastService.showError(error.message);
        throw error;
      }) 
    );
  }

  addCategory(dto: CategoryEntryDTO): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/pension/category', dto).pipe(
      catchError((error) => {
        this.toastService.showError(error.message);
        throw error;
      }) 
    );
  }


  
}
