import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { SharedDataService  } from '../shared-data.service';
import { Validators } from '@angular/forms';
import { PpoDetailsService } from 'src/app/core/services/ppoDetails/ppo-details.service';
import { PPOEntryINF } from 'src/app/core/models/ppoentry-inf';
import { SearchPopupComponent, SearchPopupConfig } from 'src/app/core/search-popup/search-popup.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Payload } from 'src/app/core/models/search-query';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})

export class DetailsComponent implements OnInit {
  religionOptions: SelectItem[];
  subDivOptions: SelectItem[];
  ppoFormDetails: FormGroup = new FormGroup({});
  ref: DynamicDialogRef | undefined;
  ManualEntrySearchForm: FormGroup = new FormGroup({});
  private ppoID: String | undefined;

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService,
    private sd: SharedDataService,
    private service: PpoDetailsService,
    private dialogService: DialogService,
  ) { 
    this.ininalizer();
    this.religionOptions = [
      { label: 'Hindu', value: 'H' },
      { label: 'Muslim', value: 'M' },
      { label: 'Other', value: 'O' }
    ];

    this.subDivOptions = [
      { label: 'Employed', value: 'E' },
      { label: 'Widow Daughter', value: 'L' },
      { label: 'Unmarried Daughter', value: 'U' },
      { label: 'Divorced Daughter', value: 'V' },
      { label: 'Minor Son', value: 'N' },
      { label: 'Minor Daughter', value: 'R' },
      { label: 'Handicapped Son', value: 'P' },
      { label: 'Handicapped Daughter', value: 'G' },
      { label: 'Dependent Father', value: 'J' },
      { label: 'Dependent Mother', value: 'K' },
      { label: 'Wife', value: 'W' },
    ];
  }

  ininalizer(): void {;
    // ManualEntrySearchForm Form builder
    this.ManualEntrySearchForm = this.fb.group({
      eppoid: [''],
    });


    this.ppoFormDetails = this.fb.group({
      receiptId: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      ppoNo: [null, [Validators.maxLength(100), Validators.minLength(0)]], /// null
      pensionerName: [null, [Validators.maxLength(100), Validators.minLength(0)]], // null
      ppoType: ["P", [Validators.required, Validators.pattern('^[PFC]$')]],
      ppoSubType: ['E', [Validators.required, Validators.pattern('^[ELUVNRPGJKHW]$')]],
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      dateOfRetirement: [null],
      dateOfCommencement: [null], // -->> api
      basicPensionAmount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      commutedPensionAmount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      reducedPensionAmount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      mobileNumber: [null, [Validators.pattern(/^[6-9]\d{9}$/)]], // null
      aadhaarNo: [null], // null
      panNo: [null], // null
      gender: ['M', [Validators.pattern('^[MFO]$')]], // null
      dateOfBirth: [null, [Validators.required]],
      religion:['H',[Validators.required, Validators.pattern('^[HMO]$')]], 
      emailId: [null, [Validators.email]], // null
      identificationMark: [null], // null
      enhancePensionAmount: ["1001", [Validators.required, Validators.pattern(/^\d+$/)]],
      pensionerAddress: [null], // null


      // ret
      effectiveDate:[''], // not in schema
      remarks: [''], // not in schema -now-> identificationMark
      doublePension: [''], // not in schema
      employedPensioner: [''], // not in schema
      reEmployed: [''], // not in schema
      adhocPension: [''], // not in schema
      provisionalPension: [''], // not in schema
      interimAllowance:[''], // not in schema
      sharedPension:[''], // not in schema

      // additional
      retirementDate: [null], //subCatDesc
      subCatDesc: [null], //subCatDesc
      categoryIdShow: [null],
      categoryDescription: [null], /// not in schema


    });
  }

  ngOnInit(): void {
    this.ppoFormDetails.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.sd.setFormValid(true);
        this.sd.setObject(this);
      }
      else {
        // this.sd.setFormValid(false);
        this.sd.setFormValid(true);
        this.sd.setObject(this);
      }
    });
  }

  getFormattedDate(date: Date | null): string {
    if (date) {
      return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
    return '';
  }

  formateDate():void {
    this.ppoFormDetails.controls['dateOfRetirement'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfRetirement')?.value));
    this.ppoFormDetails.controls['dateOfCommencement'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfCommencement')?.value));
    this.ppoFormDetails.controls['effectiveDate'].setValue(this.getFormattedDate(this.ppoFormDetails.get('effectiveDate')?.value));
    this.ppoFormDetails.controls['dateOfBirth'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfBirth')?.value));
  }

  removeNotrequiredField(): void {
    // this.ppoFormDetails.removeControl('pensionerName');
    // this.ppoFormDetails.removeControl('ppoNo');
    this.ppoFormDetails.removeControl('categoryDescription'); 
    this.ppoFormDetails.removeControl('categoryIdShow');
    this.ppoFormDetails.removeControl('subCatDesc');


    /// extra fild
    this.ppoFormDetails.removeControl('effectiveDate');
    this.ppoFormDetails.removeControl('retirementDate');
    this.ppoFormDetails.removeControl('doublePension');
    this.ppoFormDetails.removeControl('employedPensioner');
    this.ppoFormDetails.removeControl('adhocPension');
    this.ppoFormDetails.removeControl('provisionalPension');
    this.ppoFormDetails.removeControl('interimAllowance');
    this.ppoFormDetails.removeControl('sharedPension');
    this.ppoFormDetails.removeControl('reEmployed');
    this.ppoFormDetails.removeControl('remarks');

  }

  // call this method for save database
  saveData(){
    if (this.ppoFormDetails.valid || true) {
      this.formateDate()
      this.removeNotrequiredField();
      console.log(this.ppoFormDetails.value)
      this.service.CreatePPODetails(this.ppoFormDetails.value).subscribe(
        (response) => {
          console.log(response);
          this.sd.setPPOID(response.result.id)
        },
        (error) => {
          console.log(error);
          // this.toastService.showError('Failed to save data: '+error.message);
        }
      )
    }
    this.sd.object=undefined
  }

  // manual PPO entry search
  MEDetailsSearch(): void{
    let payload:Payload = {
      "pageSize":10,
      "pageIndex":0,
      "filterParameters": [],
      "sortParameters":{
        "field":"",
        "order":""
      }
    };
    // add filter parameter based on input value  // TreasuryReceiptNo
    if (this.ManualEntrySearchForm.valid) {
      const id = this.ManualEntrySearchForm.value
      const keys = Object.keys(this.ManualEntrySearchForm.value);
      payload.filterParameters = [{
        "field": "TreasuryReceiptNo",
        "value": id[keys[0]],
        "operator": "contains"
      }];
    }

    const config: SearchPopupConfig = {
      payload: payload,
      apiUrl: 'v1/manual-ppo/receipts' // mark popup api url
    };

    this.ref = this.dialogService.open(SearchPopupComponent, {
      data: config,
      header: 'Search record',
      width: '60%'
    });

    this.ref.onClose.subscribe((record: any) => {
      if (record) {
        this.ppoFormDetails.controls['receiptId'].setValue(record.id);
        this.ppoFormDetails.controls['pensionerName'].setValue(record.pensionerName);
        this.ppoFormDetails.controls['ppoNo'].setValue(record.ppoNo);
        this.ManualEntrySearchForm.controls["eppoid"].setValue(record.treasuryReceiptNo);
      }
    });
  }

  // fetch CatDescription
  fetchCatDescription(): void {
    let payload:Payload = {
      "pageSize":10,
      "pageIndex":0,
      "filterParameters": [],
      "sortParameters":{
        "field":"",
        "order":""
      }
    };

    const config: SearchPopupConfig = {
      payload: payload,
      apiUrl: 'v1/pension/category' // mark popup api url
    };


    this.ref = this.dialogService.open(SearchPopupComponent, {
      data: config,
      header: 'Search record',
      width: '60%'
    });

    this.ref.onClose.subscribe((record: any) => {
      if (record) {
        console.log(record)
        this.ppoFormDetails.controls['categoryDescription'].setValue(record.categoryName);
        this.ppoFormDetails.controls['categoryIdShow'].setValue(record.primaryCategoryId);
        this.ppoFormDetails.controls['subCatDesc'].setValue(record.subCategoryId);
        this.ppoFormDetails.controls['categoryId'].setValue(record.id);
      }
    });
  }
}
