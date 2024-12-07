import { Component, HostListener, OnInit } from '@angular/core';
import { first, firstValueFrom, retry, tap } from 'rxjs';
import { PensionBankBranchService, PensionerEntryDTO, PensionPPODetailsService } from 'src/app/api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PensionNomineeDetailsService } from 'src/app/api';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDate } from '@angular/common';
import { PensionBankAccountsService } from 'src/app/core/services/pension-bank-accounts/pension-bank-accounts.service';
import { PensionBankAccounts } from 'src/app/core/models/pension-bank-accounts';

@Component({
    selector: 'app-convart-to-family-pension',
    templateUrl: './convart-to-family-pension.component.html',
    styleUrls: ['./convart-to-family-pension.component.scss']
})
export class ConvartToFamilyPensionComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
      isMobileView: boolean = false;


  constructor(
    private ppoDetailsService: PensionPPODetailsService,
    private fb: FormBuilder,
    private nomineeDetailsService: PensionNomineeDetailsService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private bankService: PensionBankBranchService,
    
  ) { }

  onResize(event: any) {
    this.isMobileView = window.innerWidth <= 900;
}

  familyDetails?: any;
  relationshipOptions = [
    { label: 'Father', value: 'F'},
    { label: 'Mother', value:'M' },
    { label: 'Husband', value: 'H'},
    { label: 'Wife', value: 'W' },
    { label: 'Son', value: 'S'},
    { label: 'Daughter',value: 'D'},
    { label: 'Brother', value: 'B'},
    { label: 'Sister', value: 'T'},
    { label: 'Self', value: 'E'},
    { label: 'Brother(Minor)', value: 'I'},
    { label: 'Sister(Unmarried)', value: 'A'},
    { label: 'Sister(Widowed)', value: 'C'},
    { label: 'Other', value: 'O'}
  ];

  NomineeType = [
      { label: 'Pension', value: 'P' },
      { label: 'Commutation', value: 'C' },
      { label: 'Gratuity', value: 'G' },
      { label: 'All', value: 'A' },
  ];

  FamilyPensionDetails = [
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},
  ]

//     FamilyPensionDetails
  DetailsFrom: FormGroup = new FormGroup({});

  id = this.route.snapshot.paramMap.get('id') || '';

  ngOnInit() {
    console.log("Intricated");

    void this.getPpoDetails();
    this.init();

  }

  init(){
    this.DetailsFrom = this.fb.group({
        id: new FormControl(null),
        ppoId: new FormControl(null),
        category: this.fb.group({
          id: new FormControl(null),
          categoryName: new FormControl(''),
          primaryCategory: new FormControl(null),
          subCategory: new FormControl(null),
          componentRates: this.fb.array([]),
          primaryCategoryId: new FormControl(null),
          subCategoryId: new FormControl(null),
          dataSource: new FormControl(null),
        }),
        receipt: this.fb.group({
          id: new FormControl(null),
          treasuryReceiptNo: new FormControl(''),
          ppoNo: new FormControl(''),
          pensionerName: new FormControl(''),
          dateOfCommencement: new FormControl(''),
          mobileNumber: new FormControl(''),
          receiptDate: new FormControl(''),
          psaCode: new FormControl(''),
          ppoType: new FormControl(''),
          dataSource: new FormControl(null),
        }),
        branch: this.fb.group({
          id: new FormControl(1),
          bankId: new FormControl(1),
          bank: this.fb.group({
            id: new FormControl(1),
            bankName: new FormControl(''),
            dataSource: new FormControl(null),
          }),
          branchName: new FormControl(''),
          branchAddress: new FormControl(''),
          ifscCode: new FormControl(''),
          micrCode: new FormControl(''),
          city: new FormControl(null),
          district: new FormControl(null),
          state: new FormControl(null),
          pincode: new FormControl(null),
          dataSource: new FormControl(null),
        }),
        ppoSanctionDetails: this.fb.array([]),
        bankId: new FormControl(null),
        ppoNo: new FormControl(''),
        ppoType: new FormControl(''),
        ppoSubType: new FormControl(''),
        categoryId: new FormControl(null),
        branchId: new FormControl(null),
        accountHolderName: new FormControl(''),
        payMode: new FormControl(''),
        bankAcNo: new FormControl(''),
        pensionerName: new FormControl(''),
        gender: new FormControl(''),
        dateOfBirth: new FormControl(''),
        dateOfDeath: new FormControl(null),
        mobileNumber: new FormControl(''),
        emailId: new FormControl(''),
        pensionerAddress: new FormControl(''),
        identificationMark: new FormControl(''),
        panNo: new FormControl(''),
        aadhaarNo: new FormControl(''),
        dateOfRetirement: new FormControl(''),
        dateOfCommencement: new FormControl(''),
        basicPensionAmount: new FormControl(null),
        commutedPensionAmount: new FormControl(null),
        commutedFromDate: new FormControl(null),
        commutedUptoDate: new FormControl(null),
        enhancePensionAmount: new FormControl(null),
        reducedPensionAmount: new FormControl(null),
        religion: new FormControl(''),
        dataSource: new FormControl(null),
      });
  }
  async getPpoDetails() {
    if (!this.id) {
        return
    }
    await firstValueFrom(this.ppoDetailsService.getPensionerByPpoId(Number(this.id)).pipe(
      tap(
        (res) => {
            if (res.result) {
                this.DetailsFrom.patchValue(res.result)
                /// patch all date sting to Date type
                this.DetailsFrom.patchValue({
                    dateOfCommencement: new Date(this.DetailsFrom.value.dateOfCommencement),
                    dateOfDeath: new Date(this.DetailsFrom.value.dateOfDeath),
                    dateOfRetirement: new Date(this.DetailsFrom.value.dateOfRetirement),
                    commutedFromDate: new Date(this.DetailsFrom.value.commutedFromDate),
                    commutedUptoDate: new Date(this.DetailsFrom.value.commutedUptoDate)
                });
                // console.log(this.DetailsFrom.value);
                void this.getFamilyPensionDetails();

            }
      }
    )
    ));
  }

  async getFamilyPensionDetails() {
    await firstValueFrom(this.nomineeDetailsService.getNomineesByPpoId(this.DetailsFrom.value.ppoId).pipe(
      tap(
        (res) => {
            if (res.result) {
                this.familyDetails = res.result.data;
            }
            console.log(this.familyDetails);
      }
    )
    ));
  }


  async onSave(){
    // check death date exsit or not
    if (this.DetailsFrom.value["dateOfDeath"] == null) {
      this.toastService.showError("Date of Death not set");
      return;
    }

    // check Active nominee
    const activeNominees = this.familyDetails.filter((nominee: any) => nominee.nomineeActive === true);

    if (activeNominees.length <= 0) {
      this.toastService.showError("Eligible for Family Pension not seleted");
      return;
    }

    const UpdateData: PensionerEntryDTO = {
      ppoNo: this.DetailsFrom.value.ppoNo,
      ppoType: this.DetailsFrom.value.ppoType,
      ppoSubType: this.DetailsFrom.value.ppoSubType,
      categoryId: this.DetailsFrom.value.categoryId,
      bankId: activeNominees[0].branch.bank.id,
      branchId: this.DetailsFrom.value.branchId,
      accountHolderName: activeNominees[0].nomineeName,
      payMode: this.DetailsFrom.value.payMode,
      bankAcNo: activeNominees[0].bankAcNo,
      pensionerName: this.DetailsFrom.value.pensionerName,
      gender: this.DetailsFrom.value.gender,
      dateOfBirth: this.getFormattedDate(this.DetailsFrom.value.dateOfBirth),
      dateOfDeath: this.getFormattedDate(this.DetailsFrom.value.dateOfDeath),
      mobileNumber: this.DetailsFrom.value.mobileNumber,
      emailId: this.DetailsFrom.value.emailId,
      pensionerAddress: this.DetailsFrom.value.pensionerAddress,
      identificationMark: this.DetailsFrom.value.identificationMark,
      panNo: this.DetailsFrom.value.panNo,
      aadhaarNo: this.DetailsFrom.value.aadhaarNo,
      dateOfRetirement: this.getFormattedDate(this.DetailsFrom.value.dateOfRetirement),
      dateOfCommencement: this.getFormattedDate(this.DetailsFrom.value.dateOfCommencement),
      basicPensionAmount: this.DetailsFrom.value.basicPensionAmount,
      commutedPensionAmount: this.DetailsFrom.value.commutedPensionAmount,
      commutedFromDate: this.getFormattedDate(this.DetailsFrom.value.commutedFromDate),
      commutedUptoDate: this.getFormattedDate(this.DetailsFrom.value.commutedUptoDate),
      enhancePensionAmount: this.DetailsFrom.value.enhancePensionAmount,
      reducedPensionAmount: this.DetailsFrom.value.reducedPensionAmount,
      religion: this.DetailsFrom.value.religion,
    }

    console.log(UpdateData);

    if (this.id && UpdateData) {
      await firstValueFrom(this.ppoDetailsService.updatePensionerByPpoId(Number(this.id), UpdateData).pipe(
        tap(
          (res) => {
            if (res.result) {
              (res.result);
            }
          }
        )
      ))
    }
  
  }

  onReset(){
    this.init();
    this.getPpoDetails();
    this.getFamilyPensionDetails();
  }
  
  getFormattedDate(date: Date | null): string {
    if (date) {
        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
    return '';
}

}
