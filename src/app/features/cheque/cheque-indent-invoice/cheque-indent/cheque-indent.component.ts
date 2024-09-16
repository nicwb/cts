import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { bankDetails } from 'src/app/core/models/bank';
import { BankService } from 'src/app/core/services/Bank/bank.service';
import { ChequeIndentService } from 'src/app/core/services/cheque/cheque-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { chequeIndent, ChequeIndentDeatil } from 'src/app/core/models/cheque';
import { DatePipe } from '@angular/common';
interface Chequetype {
  name: string;
  code: Number;
}

@Component({
    selector: 'app-cheque-indent',
    templateUrl: './cheque-indent.component.html',
    styleUrls: ['./cheque-indent.component.scss']
})
export class ChequeIndentComponent implements OnInit {
  [x: string]: any;

  cheques!: Chequetype[];
  indentForm!: FormGroup;
  lastindex!: number;
  displayModal: boolean | undefined;
  toastservice: any;
  bankList: [] = [];
  branchlist: any[] = [];
  selectedBank: any;
  selectedBranch: any;
  bankDetails!: bankDetails | undefined;
  selectedIndex!: number;
  chequeIndentFormDetails!: chequeIndent;
  selectedTreasury: any;
  selectedmicrCode: any;
  constructor(private _fb: FormBuilder, private bankServices: BankService, private toastService: ToastService, private chequeindentService: ChequeIndentService, private datePipe: DatePipe) { }

  ngOnInit(): void {
      this.cheques = [
          { name: 'Treasury Cheque', code: 1 },
          { name: 'Others', code: 2 },
      ];
      this.indentForm = this._fb.group({
          indent_date: [''],
          memo_number: [''],
          memo_date: [''],
          memo_no: [''],
          remarks: [''],
          chequelist: this._fb.array([this.createCheque()])
      });
      // this.getBanklist()
  }
  // ___________Fromarray____________
  get chequelist(): FormArray {
      return this.indentForm.get('chequelist') as FormArray;
  }

  createCheque(): FormGroup {
      return this._fb.group({
          cheques_type: [''],
          quantity: ['']
      });
  }

  // __________add Button_________________
  // addCheque() {
  //   this.chequelist.push(this.createCheque());
  //   console.log(this.chequelist.value);
  // }
  // removeCheque(index: number) {
  //   this.chequelist.removeAt(index);
  // }

  // showBankDetails(index: number) {
  //   if (index != this.selectedIndex) {
  //     this.resetMircFinderModal();
  //   }
  //   this.displayModal = true;
  //   this.selectedIndex = index;
  //   this.getBanklist();
  // }

  // getBanklist() {
  //   this.bankServices.getBankList().subscribe((response) => {
  //     if (response.apiResponseStatus == 1) {
  //       this.bankList = response.result
  //     } else {
  //       this.toastService.showAlert(
  //         response.message,
  //         response.apiResponseStatus
  //       )
  //     }
  //   })
  // }
  // getBranchList() {
  //   this.bankServices.getBankBranches(this.selectedBank.code).subscribe((response) => {
  //     if (response.apiResponseStatus == 1) {
  //       this.branchlist = response.result
  //     } else {
  //       this.toastService.showAlert(
  //         response.message,
  //         response.apiResponseStatus
  //       )
  //     }
  //   })
  // }
  // setMicrCodeInputField(micrCode: string | undefined) {
  //   const group = this.chequelist.at(this.selectedIndex) as FormGroup;
  //   group.patchValue({ micr_code: micrCode });
  //   this.displayModal = false;
  //   this.resetMircFinderModal();
  // }
  // resetMircFinderModal() {
  //   this.selectedBank = 0;
  //   this.selectedBranch = 0;
  //   this.bankDetails = undefined;
  // }
  // getBranchDeatils() {
  //   if (this.selectedBank) {
  //     this.bankServices.getBranchDetail(this.selectedBranch.code).subscribe((response) => {
  //       if (response.apiResponseStatus == 1) {
  //         this.bankDetails = response.result
  //       } else {
  //         this.toastService.showAlert(
  //           response.message,
  //           response.apiResponseStatus
  //         )
  //       }
  //     })
  //   }

  // }

  indentFormSubmit() {
      let formattedIndentDate: string | null = '';
      let memoDate: string | null = '';
      if (this.indentForm) {
          const indentDateValue = this.indentForm.get('indent_date')?.value;
          if (indentDateValue !== null && indentDateValue !== undefined) {
              formattedIndentDate = this.datePipe.transform(indentDateValue, 'yyyy-MM-dd');
              console.log(formattedIndentDate);
          }
          const memoDateValue = this.indentForm.get('memo_date')?.value;
          if (memoDateValue !== null && memoDateValue !== undefined) {
              memoDate = this.datePipe.transform(memoDateValue, 'yyyy-MM-dd');
          }
          this.chequeIndentFormDetails = {
              indentDate: formattedIndentDate as string,
              memoNumber: this.indentForm.get('memo_number')?.value,
              memoDate: memoDate as string,
              remarks: this.indentForm.get('remarks')?.value,
              treasurieCode: this.selectedTreasury,
              chequeIndentDeatils: this.chequelist.controls.map<ChequeIndentDeatil>(fa => {
                  const formGroup = fa as FormGroup;
                  return {
                      chequeType: formGroup.get("cheques_type")?.value,
                      micrCode: this.selectedmicrCode,
                      quantity: formGroup.get("quantity")?.value,
                  }
              })
          }
          console.log('----->>>>',this.chequeIndentFormDetails);
      
          this.chequeindentService.chqueIndentEntry(this.chequeIndentFormDetails).subscribe((response) => {
              if (response.apiResponseStatus == 1) {
                  this.indentForm.reset();
                  this.chequelist.reset();
                  this.toastService.showAlert(
                      response.message,
                      response.apiResponseStatus,
                  );
              } else {
                  this.toastService.showError(response.message);
              }
          })
      }


  }

  onTreasurySelected($event: string) {
      this.selectedTreasury = $event;
  }
  handelInputValueChange($event: string) {
      this.selectedmicrCode = $event;
      console.log('Selected :', this.selectedmicrCode);

  }

}
