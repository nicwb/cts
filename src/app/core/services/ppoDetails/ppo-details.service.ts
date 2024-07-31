import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { PPOEntryINF } from '../../models/ppoentry-inf';
import { IapiResponce } from '../../models/iapi-responce';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PpoDetailsService {
  apiUrl = "v1/ppo/details";
  constructor(
    private http: HttpClient, 
    private toastService: ToastService
  ) {}
  
  CreatePPODetails(
    queryParameters: PPOEntryINF
  ): Observable<IapiResponce<PPOEntryINF>> {
    return this.http
      .patch<IapiResponce<PPOEntryINF>>(
        this.apiUrl,
        queryParameters
      )
      .pipe(
        catchError((error) => {
          throw this.toastService.showError(error.message);
        })
      );
  }
}
