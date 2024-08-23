import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PPOBankAccountCreateService } from 'src/app/core/services/PPOBankAccountCreate/ppobank-account-create.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { BankService, BranchDeatilsDTOAPIResponse, DropdownDTOIEnumerableAPIResponse } from 'src/app/api';
import { firstValueFrom, Observable } from 'rxjs';
import { FirstLetterPipe } from 'src/app/core/pipe/first-letter.pipe';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})

export class BankDetailsComponent implements OnInit {
  BankDetailsForm: FormGroup = new FormGroup({});
  private ppoID?:string;

  banks$ : Observable<DropdownDTOIEnumerableAPIResponse> | undefined;
  bankIFC$ : Observable<BranchDeatilsDTOAPIResponse> | undefined;
  
  constructor(
    private fb: FormBuilder,
    private service: PPOBankAccountCreateService,
    private toastService: ToastService,
    private BankService: BankService,
  ) { 
    this.ininalizer();
    this.banks$ = this.BankService.getAllBanks();
  }
  ininalizer(){
    this.BankDetailsForm= this.fb.group({
      payMode:['treasury'],
      bankBranchName:[''],
      accountNo:[''],
      accountHolderName:[''],
      IFSCCode:[''],
    });


  }
  ngOnInit(): void {
    this.banks$?.subscribe(
      res=>{
        console.log(res);
      }
    );
      
  }

  saveData():boolean {
    console.log("Saving dat");
    console.log(this.BankDetailsForm.valid);
    if (this.BankDetailsForm.valid && this.ppoID) {
      console.log("Saving")
      this.service.createPensonarBankAccount(this.BankDetailsForm.value, this.ppoID).subscribe(
        (responce)=>{
          if (responce.apiResponseStatus === 1) {
            this.toastService.showSuccess(responce.message);
            // return true; // enable when nex slide ready
            return false; // stop go next
          }
          this.toastService.showAlert(responce.message, 2);
          return false;
        },

        (error)=>{
          this.toastService.showError(error);
        }
      );
    }
    return false;
  }


  // execute for fetching all banks name
  searchBank() {
    
  }
}
 