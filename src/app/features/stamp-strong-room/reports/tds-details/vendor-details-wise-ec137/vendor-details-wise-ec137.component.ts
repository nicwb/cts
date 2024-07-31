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
  ec137Form: FormGroup = new FormGroup({})
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
    this.ec137Form = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generateEC137() {
    this.isLoading = true
    if (this.ec137Form.valid) {
      const payload = {
        fromDate: formatDate(this.ec137Form.value.fromDate),
        toDate: formatDate(this.ec137Form.value.toDate)
      }
      this.stampReportService.getEC137(payload).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.data = response.result
          this.isLoading = true
        } else {
          this.toastService.showError(response.message)
        }
      })
      console.log(payload);
      
    }
  }

}
