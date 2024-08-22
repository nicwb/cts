import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { SharedDataService } from './shared-data.service';
import { firstValueFrom, Observable, tap, catchError, EMPTY } from 'rxjs';
import { PensionPPODetailsService } from 'src/app/api';

import { ChangeDetectorRef } from '@angular/core';

// Define the interface for the records
interface PPORecord {
  [key: string]: any;
}

// Define the interface for the data
interface PPOData {
  headers: Array<{ fieldName: string; name: string }>;
  data: PPORecord[];
}

@Component({
  selector: 'app-ppodetails',
  templateUrl: './ppodetails.component.html',
  styleUrls: ['./ppodetails.component.scss'],
})
export class PpodetailsComponent implements OnInit {
  currentStepIndex = 0;
  steps = [
    { label: 'PPO Details' },
    { label: 'Bank Details' },
    { label: 'Sanction Details' },
    { label: 'Family Nominee' },
  ];
  isFormValid = false;
  ppoID?: string;
  allPPOs$?: Observable<any>;
  viewMode = true;
  ppoSearchField = '';
  records: PPORecord[] = [];
  cols: Array<{ field: string; header: string }> = [];
  data: PPOData = { headers: [], data: [] };
  tableMsg = '';
  isLoading = false;

  // component data
  ppoId?: any;

  constructor(
    private toastService: ToastService,
    private sd: SharedDataService,
    private ppoDetialsService: PensionPPODetailsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeToDataChanges();
    this.loadPPOData();
  }

  private subscribeToDataChanges(): void {
    this.sd.isFormValid$.subscribe(status => this.isFormValid = status);
    this.sd.ppoID$.subscribe(status => this.ppoID = status);
  }

  private async loadPPOData(): Promise<void> {
    this.isLoading = true;

    try {
      const payload = {
        pageSize: 10,
        pageIndex: 0,
        filterParameters: [],
        sortParameters: { field: '', order: '' },
      };
      
      this.allPPOs$ = this.ppoDetialsService.getAllPensioners(payload);

      await firstValueFrom(
        this.allPPOs$.pipe(
          tap(result => this.handleResponse(result)),
          catchError(error => this.handleError(error))
        )
      );
    } finally {
      this.isLoading = false;
    }
  }

  private handleResponse(response: any): void {
    if (response && response.result) {
      this.data = response.result;
      this.records = this.data.data;
      this.cols = this.data.headers.map((header: any) => ({
        field: header.fieldName,
        header: header.name,
      }));
    } else {
      this.tableMsg = 'No data available';
    }
  }

  private handleError(error: any): Observable<never> {
    this.toastService.showError('Failed to connect server!');
    this.tableMsg = 'Failed to connect server!';
    return EMPTY; // Use EMPTY to represent an observable that emits no items and immediately completes
  }

  nextMove(): void {
    if (this.ppoID) {
      this.currentStepIndex++;
    }
  }

  next(): void {
    if (this.sd.object?.saveData()) {
      this.nextMove();
    } else {
      this.nextMove();
    }
  }

  prev(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
    else{
      this.viewMode = true;
    }
  }

  handleSelectedRow(event: any): void {
    console.log('Selected row:', event);
    this.sd.setPPOID(event.ppoId);
    // Optionally, navigate to the next step
    // this.next();
  }

  viewChange(state: boolean): void {
    if (state) {
      this.loadPPOData();
    } else {
      this.viewMode = false;
    }
  }

  newPPOEntry(): void {
    console.log('Showing New PPO entry');
    this.viewMode = false;
  }

  search(): void {
    this.tableMsg = '';

    if (this.ppoSearchField.trim() === '') {
      this.data.data = [...this.records];
      return;
    }

    const lowerCaseSearchTerm = this.ppoSearchField.toLowerCase();

    this.data.data = this.records.filter(record => 
      Object.values(record).some(value => 
        typeof value === 'string' || typeof value === 'number'
          ? value.toString().toLowerCase().includes(lowerCaseSearchTerm)
          : false
      )
    );

    if (this.data.data.length === 0) {
      this.tableMsg = 'No records found';
    }
  }

  editThisRecord(record: PPORecord): void {
    // this.ppoId=record.id;
    if (record['ppoId']) {
      this.ppoId = record['ppoId'];
      this.cdr.detectChanges();
    }
    this.viewChange(false);
  }
}
