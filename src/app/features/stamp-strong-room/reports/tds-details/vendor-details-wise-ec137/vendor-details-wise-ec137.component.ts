import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';
import { formatDate } from 'src/utils/dateToString';

@Component({
  selector: 'app-vendor-details-wise-ec137',
  templateUrl: './vendor-details-wise-ec137.component.html',
  styleUrls: ['./vendor-details-wise-ec137.component.scss']
})
export class VendorDetailsWiseEC137Component implements OnInit {

  maxDateLimit: Date = new Date()
  ec137Form: FormGroup = new FormGroup({})
  isLoading: boolean = false
  tableData!: DynamicTable<any>;
  constructor(
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.initiaiozeForm();
    // this.tableData.headers = [
    //   {
    //     name: "string",
    //     dataType: "string",
    //     fieldName: "string",
    //     collapsible: false,
    //     filterField: "string",
    //     isSortable: false,
    //     isFilterable: false
    //   }
    // ]
  }
  initiaiozeForm() {
    this.ec137Form = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generateEC137() {
    if (this.ec137Form.valid) {
      const payload = {
        fromDate: formatDate(this.ec137Form.value.fromDate),
        toDate: formatDate(this.ec137Form.value.toDate)
      }
      console.log(payload);
      
    }
  }

}
