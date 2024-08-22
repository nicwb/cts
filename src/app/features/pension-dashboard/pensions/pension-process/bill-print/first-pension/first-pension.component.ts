import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PensionFirstBillService, InitiateFirstPensionBillDTO, BankService, PensionPPODetailsService, ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse } from 'src/app/api'; 
import { ToastService } from 'src/app/core/services/toast.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { PdfGenerationService } from 'src/app/core/services/first-pension/pdf-generation.service';
import { FirstPensionService } from 'src/app/core/services/first-pension/first-pension.service';
import { EMPTY, Observable, of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SearchPopupComponent } from 'src/app/core/search-popup/search-popup.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
  selector: 'app-first-pension',
  templateUrl: './first-pension.component.html',
  styleUrls: ['./first-pension.component.scss'],
  providers: [DatePipe,MessageService, ConfirmationService, DialogService]
})
export class FirstPensionComponent implements OnInit {
  FirstPensionForm: FormGroup = this.fb.group({
    generation: ['', Validators.required], 
    ppoId: ['', Validators.required],
    pensionerName: ['', Validators.required]
  });
  ref: DynamicDialogRef | undefined;
  pensionData: any[] = [];
  isLoading: boolean = false;
  showDialog: boolean = false;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  selectedPension: any;
  pdfData: any;
  pensionerList$?:Observable<ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse>;
  generationResult$: Observable<any> | undefined;
  pensionComponent$?: Observable<any>;
  
  

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService, 
    private pensionFirstBillService: PensionFirstBillService,
    private pdfGenerationService: PdfGenerationService,
    private firstPensionService: FirstPensionService,
    private pensionPPODetailsService: PensionPPODetailsService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.FirstPensionForm = this.fb.group({
      generation: [''],
      ppoId: ['', Validators.required],
      pensionerName: ['', Validators.required]
    });
    this.tableQueryParameters = {
      pageSize: 50,
      pageIndex: 0,
    };
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

  handleSelectedRowByPensionComponent(event: any) {
    console.log(event);

    this.FirstPensionForm.controls['ppoId'].setValue(event.ppoId);
    this.FirstPensionForm.controls['pensionerName'].setValue(event.pensionerName);
}

  

  onRefresh(): void {
    this.FirstPensionForm.reset();
    this.pensionData = [];
    this.showDialog = false;
  }

  onRowSelect(event: any) {
    this.selectedPension = event.data;
    this.FirstPensionForm.patchValue({
      ppoId: this.selectedPension.ppoId,
      pensionerName: this.selectedPension.pensionerName
    });
    this.showDialog = false;
  }

  onGenerate(generationType: string): Observable<any> {
    if (!this.isFormValid()) {
      this.toastService.showError('Please complete all required fields and select a report type.');
      return EMPTY;
    }
    
    if (generationType === 'generalBill') {
      return this.generatePDF();
    } else if (generationType === 'classificationBill') {
      console.log('Generating classification bill...');
      return EMPTY;
    }
    
    return EMPTY;
  }
  

  isFormValid(): boolean {
    return this.FirstPensionForm.valid && this.FirstPensionForm.get('generation')?.value;
  }
  
  
  generatePDF(): Observable<any> {
    const ppoId = this.FirstPensionForm.get('ppoId')?.value;
    if (!ppoId) {
      this.toastService.showError('Please select a PPO ID first');
      return EMPTY;
    }
  
    const payload: InitiateFirstPensionBillDTO = {
      ppoId: ppoId,
      toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')?.toString() ?? ''
    };
  
    return this.pensionFirstBillService.generateFirstPensionBill(payload).pipe(
      switchMap(response => {
        this.pdfData = {
          response: response,
          bankName: '',
          branchName: '',
          branchAddress: ''
        };
        return this.bankService.getAllBanks().pipe(
          switchMap(bankResponse => {
            this.pdfData.bankName = bankResponse.result;
            return this.bankService.getBranchByBranchCode(this.pdfData.response.result.bankAccount.branchCode);
          }),
          tap(branchResponse => {
            this.pdfData.branchAddress = branchResponse.result;
            this.pdfData.branchName = branchResponse.result?.branchName;
            this.pdfGenerationService.generatePdf(this.pdfData);
          }),
          catchError(error => {
            console.error('Error:', error);
            this.toastService.showError('Error generating PDF');
            return EMPTY;
          })
        );
      })
    );
  }
  

  

  openPdfInNewTab(pdfData: Blob) {
    const pdfUrl = URL.createObjectURL(pdfData);
    window.open(pdfUrl, '_blank');
  }

  createPDF(data: any) {
    const doc = new jsPDF();
    const formValues = this.FirstPensionForm.value;

    doc.text('Manual PPO Register Report', 60, 10);
    doc.text(`From Date: ${formValues.fromDate}`, 10, 20);
    doc.text(`To Date: ${formValues.toDate}`, 10, 30);
    doc.text('Hello John Doe', 10, 40);
    doc.text(`PPO No: ${data.result.ppoNo}`, 10, 50);
    doc.text(`Pensioner Name: ${data.result.pensionerName}`, 10, 60);
    doc.save('manual-ppo-register.pdf');
  }

  // generateExcel() {
  //   const payload: PpoBillEntryDTO = {
  //     pensionerId: 1,
  //     bankAccountId: 1,
  //     ppoId: 28,
  //     fromDate: "2022-01-01",
  //     toDate: "2022-01-31",
  //     billType: "Monthly",
  //     billDate: "2022-02-01",
  //     grossAmount: 10000.0,
  //     byTransferAmount: 500.0,
  //     netAmount: 9500.0,
  //     breakups: [
  //       {
  //         ppoId: 28,
  //         revisionId: 1,
  //         fromDate: "2022-01-01",
  //         toDate: "2022-01-31",
  //         breakupAmount: 500.0
  //       },
  //       {
  //         ppoId: 28,
  //         revisionId: 1,
  //         fromDate: "2022-01-01",
  //         toDate: "2022-01-31",
  //         breakupAmount: 1500.0
  //       }
  //     ]
  //   };
  //   this.pensionFirstBillService.saveFirstPensionBill(payload).subscribe(
  //     (response) => {
  //       this.createExcel(response);
  //     },
  //     (error) => {
  //       console.error('Error generating report:', error);
  //     }
  //   );
  // }

  createExcel(data: any) {
    const formValues = this.FirstPensionForm.value;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
      {
        "From Date": formValues.fromDate,
        "To Date": formValues.toDate,
        "PPO No": data.result.ppoNo,
        "Pensioner Name": data.result.pensionerName
      }
    ]);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Manual PPO Register');
    XLSX.writeFile(wb, 'manual-ppo-register.xlsx');
  }

  handleRowSelection(event: any) {
    // Handle row selection
  }

  handleButtonClick(event: any) {
    // Handle button click
  }

  handQueryParameterChange(event: any) {
    // Handle query parameter change
  }

  handsearchKeyChange(event: any) {
    // Handle search key change
  }
}
