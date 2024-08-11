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
  isLoading: boolean = false
  tableData!: DynamicTable<any>;
  maxDateLimit: Date = new Date()
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private stampReportService: StampReportsService) { }

  ngOnInit(): void {
  }

  generateEC134($event: any) {
    this.isLoading = true
    this.stampReportService.getEC($event, 'EC134').subscribe((response) => {
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
