import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SearchPopupService } from './search-popup.service';
import { ToastService } from '../services/toast.service';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse, ObjectJsonAPIResponse } from 'src/app/api';

import { IapiResponce } from '../models/iapi-responce';

// 
export interface SearchPopupConfig {
  payload: any;
  apiUrl: string; // API URL parameter
  responseInterface?: new () => any; // Optional if not needed
}

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
})
export class SearchPopupComponent implements OnInit {
  records: any[] = [];
  cols: any[] = [];
  filteredRecords: any[] = [];
  searchTerm: string = '';
  noresult:string = '';

  service$?:Observable<ObjectJsonAPIResponse>;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private search: SearchPopupService,
    private tostservice: ToastService
  ) {}

  ngOnInit(): void {
    this.popUpfunction();
  }

  popUpfunction(): void {
    this.service$ = this.config.data;

    this.service$?.subscribe(
      (response) => {
        if (response && response.result) {
          const { headers, data } = response.result;
          this.records = data;
          this.filteredRecords = data;
          this.cols = headers.map((header: any) => ({
            field: header.fieldName,
            header: header.name
          }));
        } else {
          console.error('Invalid API response structure', response);
        }
      },
    )


  }
  selectRecord(record: any): void {
    this.ref.close(record);
  }

  filterRecords(): void {
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      // Filter records based on any property value that contains the search term, case-insensitive.
      this.filteredRecords = this.records.filter(record =>
        Object.values(record).some(value => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value.toString().toLowerCase().includes(lowerCaseSearchTerm);
          }
          return false;
        })
      );
      if (this.filterRecords.length === 0){

        this.noresult = 'No records found';

      }else{
        this.noresult = '';
      }
    } else {
      this.filteredRecords = [...this.records];
      this.noresult = '';
    }
  
  }

  
}
