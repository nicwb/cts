import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';
import { StampReportsService } from 'src/app/core/services/stamp/stamp-reports.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDate } from 'src/utils/dateToString';

@Component({
  selector: 'app-vendor-wise-ec136',
  templateUrl: './vendor-wise-ec136.component.html',
  styleUrls: ['./vendor-wise-ec136.component.scss']
})
export class VendorWiseEC136Component implements OnInit {

  data: any[] = []
  maxDateLimit: Date = new Date()
  ec136Form: FormGroup = new FormGroup({})
  isLoading: boolean = false
  tableData!: DynamicTable<any>;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private stampReportService: StampReportsService) { }

  ngOnInit(): void {
    this.initiaiozeForm();
  }
  initiaiozeForm() {
    this.ec136Form = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generateEC136() {
    this.isLoading = false
    if (this.ec136Form.valid) {
      const payload = {
        fromDate: formatDate(this.ec136Form.value.fromDate),
        toDate: formatDate(this.ec136Form.value.toDate)
      }
      this.stampReportService.getEC(payload, 'EC136').subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          // response.result.headers = this.headers
          // this.tableData = response.result
          this.data = response.result
          this.isLoading = true
        } else {
          this.toastService.showError(response.message)
        }
      })
    } else {
      this.toastService.showWarning("Please fill all the fileds")
    }
  }
}
