import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicTable } from 'mh-prime-dynamic-table';

@Component({
  selector: 'app-vendor-wise-ec136',
  templateUrl: './vendor-wise-ec136.component.html',
  styleUrls: ['./vendor-wise-ec136.component.scss']
})
export class VendorWiseEC136Component implements OnInit {

  maxDateLimit: Date = new Date()
  ec136Form: FormGroup = new FormGroup({})
  isLoading: boolean = false
  tableData!: DynamicTable<any>;
  constructor(
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.initiaiozeForm();
    this.tableData.headers = [
      {
        name: "string",
        dataType: "string",
        fieldName: "string",
        collapsible: false,
        filterField: "string",
        isSortable: false,
        isFilterable: false
      }
    ]
  }
  initiaiozeForm() {
    this.ec136Form = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generateEC136() {
    if (this.ec136Form.valid) {
      const payload = {
        fromDate: this.ec136Form.value.fromDate,
        toDate: this.ec136Form.value.toDate
      }
      console.log(payload);
      
    }
  }
}
