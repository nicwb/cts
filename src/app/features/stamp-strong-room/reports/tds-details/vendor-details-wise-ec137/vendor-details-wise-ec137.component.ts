import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';
import { StampReportsService } from 'src/app/core/services/stamp/stamp-reports.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDate } from 'src/utils/dateToString';

@Component({
  selector: 'app-vendor-details-wise-ec137',
  templateUrl: './vendor-details-wise-ec137.component.html',
  styleUrls: ['./vendor-details-wise-ec137.component.scss']
})
export class VendorDetailsWiseEC137Component implements OnInit {

  data: any[] = []
  maxDateLimit: Date = new Date()
  isLoading: boolean = false
  tableData!: DynamicTable<any>;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private stampReportService: StampReportsService) { }

  ngOnInit(): void {
  }

  generateEC137($event: any) {
    this.isLoading = true
    this.stampReportService.getEC($event, 'EC137').subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.data = response.result
      } else {
        this.toastService.showError(response.message)
      }
    })
    this.isLoading = false
  }

}
