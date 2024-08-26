import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { PensionPPODetailsService } from 'src/app/api';

@Component({
  selector: 'app-ppo-approval',
  templateUrl: './ppo-approval.component.html',
  styleUrls: ['./ppo-approval.component.scss']
})
export class PpoApprovalComponent implements OnInit {
  ApprovalForm: FormGroup = new FormGroup({});
  idList$?:Observable<any>;
  toDateList$?:Observable<any>;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private pensionPPODetailsService: PensionPPODetailsService
  ) { }

  ngOnInit(): void {
    this.ApprovalForm = this.fb.group({
      ppoId: ['', Validators.required],
      toDate: ['', Validators.required]
    })

    let payload = {
      pageSize: 10,
      pageIndex: 0,
      filterParameters: [],
      sortParameters: {
          field: '',
          order: '',
      },
  };

    this.idList$ = this.pensionPPODetailsService.getAllPensioners(payload);
    this.toDateList$ = this.pensionPPODetailsService.getAllPensioners(payload);
  }

  handlePpoSearchEvent(event: any) {
    console.log("",event);
    this.ApprovalForm.controls['ppoId'].setValue(event.ppoId);
}

  handleToDateSearchEvent(event: any) {
    console.log("",event);
    this.ApprovalForm.controls['toDate'].setValue(event.toDate);
}

  onRefresh(): void {
    this.ApprovalForm.reset();
  }

  insert(){
    console.log("Insert Button is clicked");
    
  }

  save(){
    console.log("Save Button is clicked");
    
  }

  approve(){
    console.log("Approve Button is clicked");
    
  }


}
