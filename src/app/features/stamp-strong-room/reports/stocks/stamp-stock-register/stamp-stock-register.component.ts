import { formatDate } from 'src/utils/dateToString';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';
import { StampReportsService } from 'src/app/core/services/stamp/stamp-reports.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stamp-stock-register',
  templateUrl: './stamp-stock-register.component.html',
  styleUrls: ['./stamp-stock-register.component.scss']
})
export class StampStockRegisterComponent implements OnInit {

  data: any[] = []
  maxDateLimit: Date = new Date()
  ec134Form: FormGroup = new FormGroup({})
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
    this.ec134Form = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generateEC134() {
    this.isLoading = false
    if (this.ec134Form.valid) {
      const payload = {
        fromDate: formatDate(this.ec134Form.value.fromDate),
        toDate: formatDate(this.ec134Form.value.toDate)
      }
      this.stampReportService.getEC(payload, 'EC134').subscribe((response) => {
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
