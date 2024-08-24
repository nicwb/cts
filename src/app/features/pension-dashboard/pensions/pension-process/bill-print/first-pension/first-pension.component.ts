import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionFirstBillService,BankService, PensionPPODetailsService, ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse } from 'src/app/api'; 
import { ToastService } from 'src/app/core/services/toast.service';
import { PdfGenerationService } from 'src/app/core/services/first-pension/pdf-generation.service';
import { firstValueFrom, Observable} from 'rxjs';



@Component({
  selector: 'app-first-pension',
  templateUrl: './first-pension.component.html',
  styleUrls: ['./first-pension.component.scss']
})
export class FirstPensionComponent implements OnInit {
  FirstPensionForm!: FormGroup;
  selectedPension: any;
  pdfData: any;
  pensionComponent$?: Observable<any>;

  
  

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService, 
    private pensionFirstBillService: PensionFirstBillService,
    private pdfGenerationService: PdfGenerationService,
    private pensionPPODetailsService: PensionPPODetailsService,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.FirstPensionForm = this.fb.group({
      generation: [''],
      ppoId: ['', Validators.required],
      pensionerName: ['', Validators.required]
    });
    let payload = {
      pageSize: 10,
      pageIndex: 0,
      filterParameters: [],
      sortParameters: {
          field: '',
          order: '',
      },
  };
    this.pensionComponent$ =
            this.pensionPPODetailsService.getAllPensioners(payload);
  }

  handleSearchEvent(event: any) {
    console.log("",event);
    this.FirstPensionForm.controls['ppoId'].setValue(event.ppoId);
    this.FirstPensionForm.controls['pensionerName'].setValue(event.pensionerName);
}

  

  onRefresh(): void {
    this.FirstPensionForm.reset();
  }

  onGenerate(generationType: string) {
    if (!this.isFormValid()) {
      this.toastService.showError('Please complete all required fields and select a report type.');
      return;
    }
    if (generationType === 'generalBill') {
      this.generatePDF();
    } else if (generationType === 'classificationBill') {
      console.log('Generating classification bill...');
      
    }
  }
  

  isFormValid(): boolean {
    return this.FirstPensionForm.valid && this.FirstPensionForm.get('generation')?.value;
  }
  
  
  generatePDF() {
    const ppoId = this.FirstPensionForm.get('ppoId')?.value;
    if (!ppoId) {
      this.toastService.showError('Please select a PPO ID first');
      return;
    }

    firstValueFrom(this.pensionFirstBillService.getFirstPensionBillByPpoId(ppoId)).then(response => {
      this.pdfData = {
        response: response,
        bankName: '',
        branchName: '',
        branchAddress: ''
      };
      const bankAccounts = response?.result?.pensioner?.bankAccounts;
      const branchCode = bankAccounts && bankAccounts[0] && bankAccounts[0].branchCode;
      if (!branchCode) {
        console.warn('Branch code is missing, skipping branch details');
        this.pdfGenerationService.generatePdf(this.pdfData);
        return;
      }
  
      firstValueFrom(this.bankService.getAllBanks()).then(bankResponse => {
        this.pdfData.bankName = bankResponse.result;
  
        firstValueFrom(this.bankService.getBranchByBranchCode(branchCode)).then(branchResponse => {
          this.pdfData.branchAddress = branchResponse.result?.branchAddress;
          this.pdfData.branchName = branchResponse.result?.branchName;
          this.pdfGenerationService.generatePdf(this.pdfData);
        }).catch(branchError => {
          console.error('Error fetching branch name:', branchError);
          this.toastService.showError('Error fetching branch address');
          this.pdfGenerationService.generatePdf(this.pdfData);
        });
      }).catch(bankError => {
        console.error('Error fetching bank name:', bankError);
        this.toastService.showError('Error fetching bank name');
        this.pdfGenerationService.generatePdf(this.pdfData);
      });
    }).catch(error => {
      console.error('Error generating PDF:', error);
      this.toastService.showError('Error generating PDF: ' + (error.message || 'Unknown error'));
    });
  }

}
