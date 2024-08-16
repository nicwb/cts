import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';



import { Output, EventEmitter } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { SharedDataService } from './shared-data.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Payload } from 'src/app/core/models/search-query';
import { SearchPopupComponent } from 'src/app/core/search-popup/search-popup.component';

import { PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse, PensionPPODetailsService } from 'src/app/api';
import { Observable } from 'rxjs';


interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-ppodetails',
  templateUrl: './ppodetails.component.html',
  styleUrls: ['./ppodetails.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})

export class PpodetailsComponent implements OnInit{
  currentStepIndex: number = 0;
  steps: any[];
  isFormValid:boolean=false;
  ppoID?:string;
  ref: DynamicDialogRef | undefined;

  allPPOs$?:Observable<PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse>;

  constructor(
    private toastService: ToastService,
    private sd: SharedDataService,
    private dialogService: DialogService,
    private ppoDetialsService: PensionPPODetailsService,
  ){
    this.steps = [
            { label: 'PPO Details' },
            { label: 'Bank Details' },
            { label: 'Sanction Details'},
            { label: 'Family Nominee'}
    ];
  }
  ngOnInit(): void {
    // add for detect changes in form valid or not
    this.sd.isFormValid$.subscribe(status => {
      this.isFormValid = status;
    });

    this.sd.ppoID$.subscribe(status => {
      this.ppoID = status;
    });

  }

  next_move(){
    // if alrady ppo id exists make forward else save data and do it
    if(this.ppoID != undefined || this.ppoID != null) {
      this.currentStepIndex++;
    }
  }

  next() {
    
    if (this.sd.object != undefined) {
       // universal function for all sub components
       if(this.sd.object.saveData() == true){
          this.next_move();
       }
    }else{
      this.next_move();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }
  // fetch ppoid if exists
  fetchPPOID(): void {
      console.log("Fetching ppoid")
      let payload:Payload = {
        "pageSize":10,
        "pageIndex":0,
        "filterParameters": [],
        "sortParameters":{
          "field":"",
          "order":""
        }
      };
      
      this.allPPOs$ = this.ppoDetialsService.getAllPensioners(payload);

      this.ref = this.dialogService.open(SearchPopupComponent, {
        data: this.allPPOs$,
        header: 'Search record',
        width: '60%'
      });

      this.ref.onClose.subscribe((record: any) => {
        if (record) {
          this.sd.setPPOID(record.ppoId);
          this.next();
        }
      });
  }
}