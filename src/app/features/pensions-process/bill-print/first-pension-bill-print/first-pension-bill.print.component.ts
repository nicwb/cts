import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionFirstBillService,PensionBankBranchService, PensionPPODetailsService, ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse, APIResponseStatus } from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { PdfGenerationService } from 'src/app/core/services/first-pension/pdf-generation.service';
import { firstValueFrom, Observable} from 'rxjs';
import { ActivatedRoute } from '@angular/router';



@Component({
    selector: 'app-first-pension-bill-print',
    templateUrl: './first-pension-bill-print.component.html',
    styleUrls: ['./first-pension-bill-print.component.scss']
})
export class FirstPensionBillPrintComponent implements OnInit {
    FirstPensionForm!: FormGroup;
    selectedPension: any;
    pdfData: any;
    pensionComponent$?: Observable<any>;
  @Input() ppoId?: string;



  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private pensionFirstBillService: PensionFirstBillService,
    private pensionPPODetailsService: PensionPPODetailsService,
    private pensionBankBranchService: PensionBankBranchService,
    private route: ActivatedRoute
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
      // Check if ppoId is provided via route parameters
      this.route.paramMap.subscribe(params => {
          const routePpoId = params.get('ppoId');
          if (routePpoId) {
              this.ppoId = routePpoId;
              this.fetchUserInfo();
          }
      });
  }

  handleSearchEvent(event: any) {
      console.log("",event);
      this.FirstPensionForm.controls['ppoId'].setValue(event.ppoId);
      this.FirstPensionForm.controls['pensionerName'].setValue(event.pensionerName);
  }

  async fetchUserInfo(): Promise<void> {
      if (this.ppoId) {
          try {
              if (this.pensionComponent$) {
                  const response = await firstValueFrom(this.pensionComponent$);

                  if (response && response.result && response.result.data) {
                      if (Array.isArray(response.result.data)) {

                          const matchingPensioner = response.result.data.find((p: any) => p.ppoId.toString() === this.ppoId);

                          if (matchingPensioner) {
                              this.handleSearchEvent(matchingPensioner);
                          } else {
                              console.warn('No matching pensioner found for ppoId:', this.ppoId);
                          }
                      } else {
                          console.warn('Response result data is not an array:', typeof response.result.data);
                      }
                  } else {
                      console.warn('Response, result, or data is missing:', response);
                  }
              } else {
                  console.warn('pensionComponent$ is undefined');
              }
          } catch (error) {
              console.error('Error fetching user info:', error);
              if (error instanceof Error) {
                  console.error('Error message:', error.message);
                  console.error('Error stack:', error.stack);
              }
          }
      } else {
          console.warn('No ppoId provided');
      }
      console.warn('fetchUserInfo completed');
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
          if(response.apiResponseStatus !== APIResponseStatus.Success) {
              this.toastService.showError(response.message ?? 'An unknown error occurred');
              return;
          }

          switch (true) {
          case !response?.result?.id:
              this.toastService.showError('Id is missing');
              break;
          case !response?.result?.treasuryVoucherNo:
              this.toastService.showError('TreasuryVoucherNo is missing');
              break;
          case !response?.result?.billDate:
              this.toastService.showError('BillDate is missing');
              break;
          case !response?.result?.treasuryVoucherDate:
              this.toastService.showError('TreasuryVoucherDate is missing');
              break;
          case !response?.result?.pensioner?.ppoId:
              this.toastService.showError('Ppo id is missing');
              break;
          case !response?.result?.pensioner?.ppoNo:
              this.toastService.showError('Ppo No is missing');
              break;
          case !response?.result?.pensioner?.receipt:
              this.toastService.showError('Receipt information is missing');
              break;
          case !response?.result?.pensioner?.dateOfCommencement:
              this.toastService.showError('Date of commencement is missing');
              break;
          case !response?.result?.pensioner?.pensionerName:
              this.toastService.showError('Pensioner name is missing');
              break;
          case !response?.result?.pensioner?.category:
              this.toastService.showError('Category information is missing');
              break;
          case !response?.result?.pensioner?.category?.primaryCategory:
              this.toastService.showError('PrimaryCategory information is missing');
              break;
          case !response?.result?.pensioner?.category?.primaryCategory?.hoaId:
              this.toastService.showError('Hoa id is missing');
              break;
          case !response?.result?.pensioner?.category?.categoryName:
              this.toastService.showError('Category name is missing');
              break;
          case !response?.result?.ppoBillBreakups:
              this.toastService.showError('PPO bill breakup information is missing');
              break;
          case response?.result?.ppoBillBreakups && !response?.result?.ppoBillBreakups.some(breakup => breakup.revision):
              this.toastService.showError('Revision information is missing in some or all PPO bill breakups');
              break;
          case !response?.result?.preparedBy:
              this.toastService.showError('Prepared by information is missing');
              break;
          case !response?.result?.preparedOn:
              this.toastService.showError('Prepared on information is missing');
              break;
          }

          this.pdfData = {
              response: response,
              bankName: '',
              branchName: '',
              branchAddress: ''
          };
          // if(response.result?.pensioner === null || response.result?.pensioner?.receipt === null || response.result?.pensioner?.bankAccounts === null || response.result?.pensioner?.category === null || response.result?.ppoBillBreakups === null) {
          //   this.toastService.showError('Data is missing, cannot generate PDF. Please check if all required fields are available.');
          //   return;

          // }

      }).catch(error => {
          console.error('Error generating PDF:', error);
          this.toastService.showError('Error generating PDF: ' + (error.message || 'Unknown error'));
      });
  }

}
