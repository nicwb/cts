import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { IapiResponce } from '../../models/iapi-responce';
import { Observable, catchError } from 'rxjs';
import { GetStampCategories, AddStampCategory, AddStampDiscountDetails, GetStampDiscountDetails, AddStampLabel, GetStampLabels, AddStampCombination, GetStampCombinations, AddStampType, GetStampTypes, GetStampVendors, StampVendorDetails } from '../../models/stamp';

@Injectable({
  providedIn: 'root'
})
export class StampMasterService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  // Stamp Category
  getStampLabelCategories(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampCategories>> {
    return this.http
      .patch<IapiResponce<GetStampCategories>>(
        'v1/StampMaster/StampCategoryList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampCategory(payload: AddStampCategory): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampCategory', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
  deleteStampCategory(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampCategoryById?id='+id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // Stamp Discount Details
  getStampDiscountDetailsList(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampDiscountDetails>> {
    return this.http
      .patch<IapiResponce<GetStampDiscountDetails>>(
        'v1/StampMaster/StampDiscountDetailsList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }


  addNewStampDiscountDetail(payload: AddStampDiscountDetails): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampDiscountDetails', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  deleteStampDiscountDetail(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampDiscountDetailsById?id='+ id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  getDiscount(vendorTypeId: number, stampCategoryId: number, amount: number): Observable<IapiResponce> {
    return this.http.get<IapiResponce>(`v1/StampMaster/GetDiscount?vendorTypeId=${vendorTypeId}&stampCategoryId=${stampCategoryId}&amount=${amount}`).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // Stamp Label
  getStampLabelList(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampLabels>> {
    return this.http
      .patch<IapiResponce<GetStampLabels>>(
        'v1/StampMaster/StampLabelList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampLabel(payload: AddStampLabel): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampLabel', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
  deleteStampLabel(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampLabelsById?id='+ id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // Stamp Combination
  getStampCombinationList(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampCombinations>> {
    return this.http
      .patch<IapiResponce<GetStampCombinations>>(
        'v1/StampMaster/StampCombinationList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  getAllStampCombinations(): Observable<IapiResponce<GetStampCombinations>> {
    return this.http
      .get<IapiResponce<GetStampCombinations>>(
        'v1/StampMaster/GetALLStampCombinations')
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  deleteStampCombination(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampCombinationById?id='+id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // TODO: Write the AddStampCombination Interface.
  addNewStampCombination(payload: AddStampCombination): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampCombination', payload).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // Stamp Type
  getStampTypeList(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampTypes>> {
    return this.http
      .patch<IapiResponce<GetStampTypes>>(
        'v1/StampMaster/StampTypeList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampType(paylod: AddStampType): Observable<IapiResponce> {
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampType', paylod).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  deleteStampType(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampTypesById?id='+id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }

  // Stamp Vendor

  getStampVendorDetails(): Observable<IapiResponce<StampVendorDetails>> {
    return this.http
      .get<IapiResponce<StampVendorDetails>>(
        'v1/StampMaster/GetALLStampVendors'
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }
  getStampVendorList(
    queryParameters: DynamicTableQueryParameters
  ): Observable<IapiResponce<GetStampVendors>> {
    return this.http
      .patch<IapiResponce<GetStampVendors>>(
        'v1/StampMaster/StampVendorList',
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }

  addNewStampVendor(paylod: FormData): Observable<IapiResponce> {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });
    return this.http.post<IapiResponce>('v1/StampMaster/CreateStampVendor', paylod, {headers}).pipe(
      catchError((error) => {
        console.log(error.message, error);
        
        throw this.toastService.showError(error.message);
      })
    );
  }
  deleteStampVendor(id: Number): Observable<IapiResponce> {
    return this.http.delete<IapiResponce>('v1/StampMaster/DeleteStampVendorsById?id='+ id).pipe(
      catchError((error) => {
        throw this.toastService.showError(error.message);
      })
    );
  }
}
