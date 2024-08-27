import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { Validators } from '@angular/forms';
import { Payload } from 'src/app/core/models/search-query';
import { formatDate } from '@angular/common';
import { PensionManualPPOReceiptService, PensionPPODetailsService, PensionCategoryMasterService } from 'src/app/api';
import { catchError, firstValueFrom, Observable, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})

export class DetailsComponent implements OnInit {
  religionOptions: SelectItem[];
  subDivOptions: SelectItem[];
  ppoFormDetails: FormGroup = new FormGroup({});
  ManualEntrySearchForm: FormGroup = new FormGroup({});
  allManualPPOReceipt$?:Observable<any>;
  catDescription$?:Observable<any>;
  eppoid?:any;
  categoryDescriptionFelid:string='';
  @Input() ppoId?:string | undefined | null;
  @Output() return = new EventEmitter();
  @Output() returnBank = new EventEmitter();
  legend:string = 'PPO Details';
  sechButtonStyle={height: '267%'};
  pensionerName: any;

  constructor(
    private fb: FormBuilder, 
    private PensionManualPPOReceiptService:PensionManualPPOReceiptService,
    private ppoCategoryService: PensionCategoryMasterService,
    private PensionPPODetailsService: PensionPPODetailsService,
    private tostService: ToastService,
  ) {
    this.ininalizer();
    this.MEDetailsSearch();
    this.fetchCatDescription();
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

  ngOnChanges(): void {
    if (this.ppoId) {
      this.legend="ID-"+this.ppoId;
      this.fetchPpoDetails();
    }
  }

  ininalizer(): void {
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

  ngOnInit() {
  }


  
  async fetchPpoDetails(){
    if (this.ppoId) {
      await firstValueFrom(
        this.PensionPPODetailsService.getPensionerByPpoId(Number(this.ppoId)).pipe(
          tap((res)=>{
            if(res.apiResponseStatus == 1 && res.result){
              this.patchData(res.result);
            }
            else{
              if (res.message) {
                this.tostService.showError(res.message);
              }
            }
          }),
        )
      )
    }
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
    this.ppoFormDetails.removeControl('effectiveDate');
    this.ppoFormDetails.removeControl('reducedPensionAmount');
  }

  // call this method for save database
  async saveData() {
    if (!this.ppoId) {
      try{
        this.formateDate();
      }
      catch(error){
        console.error(error);
      }
    }else{
      this.ppoFormDetails.removeControl('retirementDate');
      this.ppoFormDetails.removeControl('reducedPensionAmount');

    }
    this.removeNotrequiredField();
    console.log(this.ppoFormDetails.value);
    if (this.ppoFormDetails.valid || this.ppoId) {
      if (!this.ppoId){
        await firstValueFrom(
          this.PensionPPODetailsService.createPensioner(this.ppoFormDetails.value).pipe(
            tap((res) => {
              if (res.apiResponseStatus == 1) {
                if (res.message) {
                  this.tostService.showSuccess(res.message);
                }
                if (res.result?.ppoId) {
                      this.ppoId = String(res.result.ppoId);
                      this.pensionerName = String(res.result.pensionerName)
                      this.return.emit([this.ppoId, this.pensionerName]);
                }
              }
              else{
                if (res.message) {
                  this.tostService.showError(res.message);
                }
              }
            },
            catchError((error) => {
              this.tostService.showError('Error in saving data');
              console.error(error);
              return (error);
            })
        )));
        return;
      }
      await firstValueFrom(
        this.PensionPPODetailsService.updatePensionerByPpoId(Number(this.ppoId),this.ppoFormDetails.value).pipe(
          tap((res) => {
            if (res.apiResponseStatus == 1) {
              if (res.message) {
                this.tostService.showSuccess(res.message);
              }
            }
          },
          catchError((error) => {
            this.tostService.showError('Error in saving data');
            console.error(error);
            return (error);
          })
      )));
      return;
    }
    this.tostService.showError('Please fill all required fields');
    console.log(this.ppoFormDetails.value)
  }

  // manual PPO entry search
  MEDetailsSearch(): void{
    this.allManualPPOReceipt$ = this.PensionManualPPOReceiptService.getAllUnusedPpoReceipts();
  }

  // handelManualEntrySelectRow
  handelManualEntrySelect($event:any){
    this.ppoFormDetails.controls['receiptId'].setValue($event.id);
    this.ppoFormDetails.controls['pensionerName'].setValue($event.pensionerName);
    this.ppoFormDetails.controls['ppoNo'].setValue($event.ppoNo);
    this.eppoid = $event.treasuryReceiptNo;
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
    const CatDescription = this.ppoFormDetails.get('categoryDescription')?.value;
    if (CatDescription) {
      payload.filterParameters = [{
        "field": "primaryCategoryId",
        "value": CatDescription,
        "operator": "contains"
      }];
    }
    this.catDescription$ = this.ppoCategoryService.getAllCategories(payload);
  }

  // handelCategoryDescription
  handelCategoryDescription($event:any){
    if ($event) {
      this.ppoFormDetails.controls['categoryDescription'].setValue($event.categoryName);
      this.ppoFormDetails.controls['categoryIdShow'].setValue($event.primaryCategoryId);
      this.ppoFormDetails.controls['subCatDesc'].setValue($event.subCategoryId);
      this.ppoFormDetails.controls['categoryId'].setValue($event.id);
    }
  }

  patchData(data:any){
    console.log(data);
    this.ppoFormDetails.patchValue(data);
    this.ppoFormDetails.controls['receiptId'].setValue(data.receipt.id);
    this.ppoFormDetails.controls['dateOfRetirement'].setValue(data.dateOfRetirement);
  }
}
