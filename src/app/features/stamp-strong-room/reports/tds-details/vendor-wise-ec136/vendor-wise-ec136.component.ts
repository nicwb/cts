import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';
import { StampReportsService } from 'src/app/core/services/stamp/stamp-reports.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-vendor-wise-ec136',
  templateUrl: './vendor-wise-ec136.component.html',
  styleUrls: ['./vendor-wise-ec136.component.scss']
})
export class VendorWiseEC136Component implements OnInit {

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

  generateEC136($event: any) {
    this.isLoading = true
    this.stampReportService.getEC($event, 'EC136').subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        // response.result.headers = this.headers
        // this.tableData = response.result
        this.data = response.result
      } else {
        this.toastService.showError(response.message)
      }
    })
    this.isLoading = false
  }
}
