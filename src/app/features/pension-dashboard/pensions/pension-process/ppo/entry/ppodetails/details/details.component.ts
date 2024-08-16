import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { SharedDataService  } from '../shared-data.service';
import { Validators } from '@angular/forms';
import { PpoDetailsService } from 'src/app/core/services/ppoDetails/ppo-details.service';
import { SearchPopupComponent } from 'src/app/core/search-popup/search-popup.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Payload } from 'src/app/core/models/search-query';
import { formatDate } from '@angular/common';

import { PensionManualPPOReceiptService, ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse, PensionCategoryMasterService } from 'src/app/api';
import { firstValueFrom, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})

export class DetailsComponent implements OnInit, OnDestroy {
  religionOptions: SelectItem[];
  subDivOptions: SelectItem[];
  ppoFormDetails: FormGroup = new FormGroup({});
  ref: DynamicDialogRef | undefined;
  ManualEntrySearchForm: FormGroup = new FormGroup({});
  private ppoID: String | undefined;

  allManualPPOReceipt$?:Observable<ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse>;
  catDescription$?:Observable<ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse>;

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService,
    private sd: SharedDataService, 
    private service: PpoDetailsService,
    private dialogService: DialogService,
    private PensionManualPPOReceiptService:PensionManualPPOReceiptService,
    private ppoCategoryService: PensionCategoryMasterService,

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
      aadhaarNo: [null, [Validators.required, this.aadhaarValidator]], // null
      panNo: [null,[Validators.required, this.panValidator]], // null
      gender: ['M', [Validators.pattern('^[MFO]$')]], // null
      dateOfBirth: [null, [Validators.required]],
      religion:['H',[Validators.required, Validators.pattern('^[HMO]$')]], 
      emailId: [null, [Validators.email]], // null
      identificationMark: [null], // null
      enhancePensionAmount: ["1001", [Validators.required, Validators.pattern(/^\d+$/)]],
      pensionerAddress: [null], // null

      // additional
      retirementDate: [null],
      subCatDesc: [null],
      categoryIdShow: [null],
      categoryDescription: [null],

      //
      effectiveDate:[null]


    });
  }

  panValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN format: 5 letters, 4 digits, 1 letter
    if (control.value && !PAN_REGEX.test(control.value)) {
      return { invalidPan: true };
    }
    return null;
  }

  aadhaarValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const AADHAAR_REGEX = /^\d{12}$/; // AADHAAR is a 12-digit number
    if (control.value && !AADHAAR_REGEX.test(control.value)) {
      return { invalidAadhaar: true };
    }
    return null;
  }

  statusChangeSubscription!: Subscription;

  ngOnInit() {    
    this.statusChangeSubscription = this.ppoFormDetails.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.sd.setFormValid(true);
        this.sd.setObject(this);
      }
      else {
        this.sd.setFormValid(false);
        this.sd.setObject(this);
      }
    });
  }
  ngOnDestroy(){
    this.statusChangeSubscription.unsubscribe();
  }

  // this function do date object to string
  getFormattedDate(date: Date | null): string {
    if (date) {
      return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
    return '';
  }

  // make this all data objet to string formate yy-mm-dd
  formateDate():void {
    this.ppoFormDetails.controls['dateOfRetirement'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfRetirement')?.value));
    this.ppoFormDetails.controls['dateOfCommencement'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfCommencement')?.value));
    this.ppoFormDetails.controls['effectiveDate'].setValue(this.getFormattedDate(this.ppoFormDetails.get('effectiveDate')?.value));
    this.ppoFormDetails.controls['dateOfBirth'].setValue(this.getFormattedDate(this.ppoFormDetails.get('dateOfBirth')?.value));
  }

  // remove that fild not required for server
  removeNotrequiredField(): void {
    this.ppoFormDetails.removeControl('categoryDescription'); 
    this.ppoFormDetails.removeControl('categoryIdShow');
    this.ppoFormDetails.removeControl('subCatDesc');
  }

  // call this method for save database
  saveData():boolean {
    console.log('saveDat');
    if (this.ppoFormDetails.valid) {
      this.formateDate()
      this.removeNotrequiredField();
      console.log(this.ppoFormDetails.value)
      this.service.CreatePPODetails(this.ppoFormDetails.value).subscribe(
        (response) => {
          console.log(response);
          this.sd.setPPOID(response.result.ppoId);
          this.toastService.showSuccess(response.message);
          this.sd.object=undefined;
          if (response.apiResponseStatus===1) {
            return true;
          }
          return false;
        },
        (error) => {
          this.toastService.showError('Failed to save data: '+error.message);
        }
      )
    }
    this.sd.object=undefined;
    return false;
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



    this.allManualPPOReceipt$ = this.PensionManualPPOReceiptService.getAllPpoReceipts(payload);
    this.ref = this.dialogService.open(SearchPopupComponent, {
      data: this.allManualPPOReceipt$,
      header: 'Search record',
      width: '60%'
    });

    firstValueFrom(
      this.ref.onClose.pipe(
        tap(
          record => {
            if (record) 
            {
              console.log(record) // degug
              this.ppoFormDetails.controls['receiptId'].setValue(record.id);
              this.ppoFormDetails.controls['pensionerName'].setValue(record.pensionerName);
              this.ppoFormDetails.controls['ppoNo'].setValue(record.ppoNo);
              this.ManualEntrySearchForm.controls["eppoid"].setValue(record.treasuryReceiptNo);
            }
          }
        )
      )
    );
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

    this.catDescription$ = this.ppoCategoryService.getAllCategories(payload);
    

    this.ref = this.dialogService.open(SearchPopupComponent, {
      data: this.catDescription$,
      header: 'Search record',
      width: '60%'
    });

    firstValueFrom(
      this.ref.onClose.pipe(
        tap(record => {
          if (record) {
            // console.log(record) // :debug
            this.ppoFormDetails.controls['categoryDescription'].setValue(record.categoryName);
            this.ppoFormDetails.controls['categoryIdShow'].setValue(record.primaryCategoryId);
            this.ppoFormDetails.controls['subCatDesc'].setValue(record.subCategoryId);
            this.ppoFormDetails.controls['categoryId'].setValue(record.id);
          }
        })
      )
    );
  }
}
