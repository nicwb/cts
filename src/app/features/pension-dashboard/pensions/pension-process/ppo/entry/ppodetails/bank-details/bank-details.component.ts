import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { PPOBankAccountCreateService } from 'src/app/core/services/PPOBankAccountCreate/ppobank-account-create.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CreatePensonarBankDTO } from 'src/app/core/models/ppoentry-inf';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  BankDetailsForm: FormGroup = new FormGroup({});
  private ppoID?:string;

  constructor(
    private fb: FormBuilder,
    private sd: SharedDataService,
    private service: PPOBankAccountCreateService,
    private toastService: ToastService,
  ) { 
    this.ininalizer();
    
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

    this.BankDetailsForm.statusChanges.subscribe(status => {
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

    this.sd.ppoID$.subscribe(status => {
      this.ppoID = status;
    });
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

}
 