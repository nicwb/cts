import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';



import { Output, EventEmitter } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { SharedDataService } from './shared-data.service';

import { Observable } from 'rxjs';
import { PensionPPODetailsService } from 'src/app/api';


interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-ppodetails',
  templateUrl: './ppodetails.component.html',
  styleUrls: ['./ppodetails.component.scss'],
})

export class PpodetailsComponent implements OnInit{
  currentStepIndex: number = 0;
  steps: any[];
  isFormValid:boolean=false;
  ppoID?:string;

  allPPOs$?:Observable<any>;

  constructor(
    private toastService: ToastService,
    private sd: SharedDataService,
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

    let payload = {
      "pageSize":10,
      "pageIndex":0,
      "filterParameters": [],
      "sortParameters":{
        "field":"",
        "order":""
      }
    };

    this.allPPOs$ = this.ppoDetialsService.getAllPensioners(payload);
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
  handleSelectedRow(event: any){
    console.log(event);
    this.sd.setPPOID(event.ppoId);
    // this.next();
  } 
}