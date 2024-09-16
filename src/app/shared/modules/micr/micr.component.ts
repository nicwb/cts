import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { bankDetails } from 'src/app/core/models/bank';
import { BankService } from 'src/app/core/services/Bank/bank.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-micr',
    templateUrl: './micr.component.html',
    styleUrls: ['./micr.component.scss']
})
export class MicrComponent {

    displayModal: boolean | undefined;
    bankList: [] = [];
    selectedBank: any;
    branchlist: any[] = []; 
    selectedBranch: any;
    selectedMicrCode: any;
    bankDetails!: bankDetails | undefined;
  @Output() inputValueChange = new EventEmitter<string>();
  constructor( private bankServices: BankService,  private toastService: ToastService, ) { }

  showBankDetails() {
      // if(index!=this.selectedIndex){
      this.resetMircFinderModal();
      // }
      this.displayModal = true;
      // this.selectedIndex = index;
      this.getBanklist();
  }

  setMicrCodeInputField(micrCode: string | undefined) {
      this.selectedMicrCode = micrCode;
      this.displayModal = false;
      this.emitInputValueChange();
      this.resetMircFinderModal();
  }

  emitInputValueChange() {
      this.inputValueChange.emit(this.selectedMicrCode);
  }

  resetMircFinderModal(){
      this.selectedBank = 0;
      this.selectedBranch = 0;
      this.bankDetails = undefined;
  }

  getBanklist( ) {
      this.bankServices.getBankList().subscribe((response) => {
          if (response.apiResponseStatus == 1) {
              this.bankList = response.result
          } else {
              this.toastService.showAlert(
                  response.message,
                  response.apiResponseStatus
              )
          }
      })
  }

  getBranchList() {
      this.bankServices.getBankBranches(this.selectedBank.code).subscribe((response) => {
          if (response.apiResponseStatus == 1) {
              this.branchlist = response.result
          } else {
              this.toastService.showAlert(
                  response.message,
                  response.apiResponseStatus
              )
          }
      })
  }
  getBranchDeatils() {
      if (this.selectedBank) {
          this.bankServices.getBranchDetail(this.selectedBranch.code).subscribe((response) => {
              if (response.apiResponseStatus == 1) {
                  this.bankDetails = response.result
              } else {
                  this.toastService.showAlert(
                      response.message,
                      response.apiResponseStatus
                  )
              }
          })
      }

  }

}
