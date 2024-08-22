import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-popup-table',
  templateUrl: './popup-table.html',
  styleUrls: []
})
export class popupTableComponent{
  @Input() service$?: Observable<any> | null | undefined; // Optional service
  @Input() data: { headers: any, data: any } = { headers: [], data: [] }; // Optional data
  @Input() title: string = "Search"; // Optional data
  @Input() name: string = ""; // Optional data
  @Input() style: any = { width: 'auto' }; // optional data
  @Input() buttonStyle: any = [];
  @Output() return = new EventEmitter<any>(); // Emit selected row
  @Output() loads = new EventEmitter<any>();
  @ViewChild('searchPopupDIT') table: ElementRef | undefined;

  display: boolean = false;
  records: any[] = [];
  cols: any[] = [];
  searchTerm?: string;
  onresult: string = '';
  totalRecords = 0;
  isLoading: boolean = false;

  debugState?: boolean;
  debug(msg: any) {
    // this.debugState = true; // Set debugState to true to enable debug logging
    if (this.debugState) {
      console.log(msg);
    }
  }


  async showDialog() {
    this.debug("Showing SearchDialog...");
    this.isLoading = true;
    await this.callService();
    

    if (this.data) {
      const { headers, data } = this.data;
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

  async callService(){
    if (this.service$) {
      await firstValueFrom(this.service$.pipe(
        tap(response => {
          this.debug(["serviceSearchPopUp", response]);
          if (response && response.result) {
            this.data = response.result;
          } else {
            this.debug(response);
          }
        })
      ));
      this.isLoading = false;
    }
  }

  closeDialog() {
    this.display = false;
    this.debug('Closing SearchDialog');
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

      if (this.data.data.length === 0) {
        this.onresult = 'No records found';
      } else {
        this.onresult = '';
      }

    } else {
      this.data.data = [...this.records];
      this.onresult = '';
    }
  }

  loadMore(event: any) {
    this.debug(this.totalRecords);
  }
}
