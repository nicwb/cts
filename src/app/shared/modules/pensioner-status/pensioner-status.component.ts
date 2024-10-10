import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PensionerStatusService } from 'src/app/core/services/pensionerStatus/pensioner-status.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { pensionerStatusDTO } from 'src/app/core/models/pensioner-status';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-pensioner-status',
    templateUrl: './pensioner-status.component.html',
    styleUrls: ['./pensioner-status.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PensionerStatusComponent),
            multi: true
        }
    ]
})
export class PensionerStatusComponent implements OnInit, ControlValueAccessor {
  @Input() approvedText: string = 'Approved';
  @Input() notApprovedText: string = 'Not Approved';
  @Input() readonly: boolean = false;
  @Input() ppoId!: number;
  @Input() statusFlag!: number;

  statusOptions: SelectItem[] = [];
  selectedStatus: number | null = null;
  previousStatus: number | null = null;
  statusWef: string = '2024-05-31';

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(
    private toastService: ToastService,
    private pensionerStatusService: PensionerStatusService
  ) {}

  ngOnInit(): void {
      this.statusOptions = [
          { label: this.approvedText, value: 1 },
          { label: this.notApprovedText, value: 0 }
      ];
      //   this.getData();
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
                  this.selectedStatus = response.result.statusFlag > 0 ? 1 : 0;
              } else {
                  this.selectedStatus = 0;
              }
              this.previousStatus = this.selectedStatus;
              console.log('Current status:', this.selectedStatus);
              this.onChange(this.selectedStatus);
              this.onTouch();
          });
  }

  onStatusChange(event: any): void {
      if (this.readonly) return;

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
      this.onChange(newStatus);
      this.onTouch();
  }

  addStatus(): void {
      const statusData: pensionerStatusDTO = { statusFlag: this.statusFlag, ppoId: this.ppoId, statusWef: this.statusWef };
      this.pensionerStatusService.addStatus(statusData).subscribe(
          (response) => {
              console.log('Status updated:', response);
              this.toastService.showSuccess('Status updated to ' + this.approvedText);
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
              this.toastService.showSuccess('Status updated to ' + this.notApprovedText);
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

  getStatusIcon(): string {
      return this.selectedStatus === 1 ? 'pi pi-check' : 'pi pi-times';
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
      if (value !== undefined) {
          this.selectedStatus = value;
      }
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
      this.readonly = isDisabled;
  }
}