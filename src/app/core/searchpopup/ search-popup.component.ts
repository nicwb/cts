// search-popup.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { firstValueFrom, Observable, observable, tap } from 'rxjs';
import { ObjectJsonAPIResponse } from 'src/app/api';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: []
})
export class SearchPopupComponentTemp {
  @Input() service$?:Observable<any>; // Optional service
  @Input() data: {headers: any, data: any} = {headers:[],data:[]}; // Optional data

  @Input() title: string = "Search"; // Optional data
  @Input() name: string = "Search"; // Optional data

  @Input() style: any = {width: 'fit-content'};
  @Output() return = new EventEmitter<any>(); // Emit selected row
  
  display: boolean = false;
  records: any[] = [];
  cols: any[] = [];
  searchTerm?: string;
  onresult:string = '';

  async showDialog() {
    if (this.service$) {
      await firstValueFrom(this.service$.pipe(
        tap(response => {
          if (response && response.result) {
                this.data = response.result;
          }
          else {
            console.error('Invalid API response structure', response);
          }
        })
      ));
    }

    if (this.data) {
      const {headers, data} = this.data;
      this.records = this.data.data;
      
      if (headers) {
        this.cols = this.data.headers.map((header: any) => ({
          field: header.fieldName,
          header: header.name
        }));
      }
    }

    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  onRowSelect(event: any) {
    this.closeDialog();
    if (event) {
      this.return.emit(event);
    }
  }

  searchRecords(): void {
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
  
      this.data.data = this.records.filter(record =>
        Object.values(record).some(value => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value.toString().toLowerCase().includes(lowerCaseSearchTerm);
          }
          return false;
        })
      );

      if (this.data.data.length === 0){

        this.onresult = 'No records found';

      }else{
        this.onresult = '';
      }

    } else {
      this.data.data = [...this.records];
      this.onresult = '';
    }
  }
}
