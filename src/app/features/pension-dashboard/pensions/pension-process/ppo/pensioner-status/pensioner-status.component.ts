import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PensionerStatusService } from 'src/app/core/services/pensionerStatus/pensioner-status.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { pensionerStatusDTO } from 'src/app/core/models/pensioner-status';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-pensioner-status',
  templateUrl: './pensioner-status.component.html',
  styleUrls: ['./pensioner-status.component.scss']
})
export class PensionerStatusComponent implements OnInit {
  statusOptions: SelectItem[] = [
    { label: 'Approved', value: 1 },
    { label: 'Not Approved', value: 0 }
  ];
  selectedStatus: number | null = null;
  previousStatus: number | null = null;
  ppoId: number = 10;
  statusFlag: number = 1;
  statusWef: string = '2024-05-31';

  constructor(
    private toastService: ToastService,
    private pensionerStatusService: PensionerStatusService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.pensionerStatusService.getStatus(this.ppoId, this.statusFlag)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showError('Failed to fetch status: ' + error.message);
          return throwError(error);
        })
      )
      .subscribe((response) => {
        console.log('Status response after getData: ', response);    
        if (response.result && response.result.statusFlag !== undefined) {
          this.selectedStatus = response.result.statusFlag === 1 ? 1 : 0;
        } else {
          this.selectedStatus = 0;
        }
        this.previousStatus = this.selectedStatus;
        console.log('Current status:', this.selectedStatus);
      });
  }

  onStatusChange(event: any): void {
    const newStatus = event.value;
    console.log('Previous status:', this.previousStatus);
    console.log('New status:', newStatus);

    if (newStatus !== this.previousStatus) {
      if (newStatus === 1) {
        this.addStatus();
      } else {
        this.deleteStatus();
      }
    }
  }

  addStatus(): void {
    const statusData: pensionerStatusDTO = { statusFlag: this.statusFlag, ppoId: this.ppoId, statusWef: this.statusWef };
    this.pensionerStatusService.addStatus(statusData).subscribe(
      (response) => {
        console.log('Status updated:', response);
        this.toastService.showSuccess('Status updated to Approved');
        this.previousStatus = 1;
      },
      (error: HttpErrorResponse) => {
        this.toastService.showError('Failed to update status: ' + error.message);
        this.selectedStatus = 0; 
        this.previousStatus = 0;
      }
    );
  }

  deleteStatus(): void {
    this.pensionerStatusService.deleteStatus(this.ppoId, this.statusFlag).subscribe(
      (response) => {
        console.log('Status deleted:', response);
        this.toastService.showSuccess('Status updated to Not Approved');
        this.previousStatus = 0;
      },
      (error: HttpErrorResponse) => {
        this.toastService.showError('Failed to update status: ' + error.message);
        this.selectedStatus = 1; 
        this.previousStatus = 1;
      }
    );
  }

  getStatusClass(status: number): string {
    return status === 1 ? 'status-approved' : 'status-not-approved';
  }
}
