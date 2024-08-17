import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirstPensionService } from 'src/app/core/services/first-pension/first-pension.service';
import { ToastService } from 'src/app/core/services/toast.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { PdfGenerationService } from 'src/app/core/services/first-pension/pdf-generation.service';
import { ApiModule } from '../../../../../../api/api.module';
import { InitiateFirstPensionBillDTO } from '../../../../../../api/model/initiateFirstPensionBillDTO';
import { DateOnly } from 'src/app/api';



@Component({
  selector: 'app-first-pension',
  templateUrl: './first-pension.component.html',
  styleUrls: ['./first-pension.component.scss'],
  providers: [DatePipe]
})
export class FirstPensionComponent implements OnInit {
  FirstPensionForm: FormGroup = new FormGroup({});
  pensionData: any[] = [];
  isLoading: boolean = false;
  showDialog: boolean = false;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  selectedPension: any;

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService, 
    private firstPensionService: FirstPensionService,
    private pdfGenerationService: PdfGenerationService,
    private datePipe: DatePipe
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
  }

  onSearch() {
    this.isLoading = true;
    this.pensionData = []; // Clear existing data

    this.firstPensionService.searchAll(this.tableQueryParameters).subscribe(
      (response) => {
        console.log('Search results:', response);
        
        this.pensionData = response.result?.data || [];
        this.isLoading = false;
        this.showDialog = true;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching search results:', error);
        this.toastService.showError('Error fetching search results');
      }
    );
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

  onGenerate(generationType: string) {
    console.log("The selected generation type is :", generationType);
    if (generationType === 'pdf') {
      this.generatePDF();
    } else if (generationType === 'excel') {
      this.generateExcel();
    }
  }

  generatePDF() {
    const ppoId = this.FirstPensionForm.get('ppoId')?.value;
    if (!ppoId) {
      this.toastService.showError('Please select a PPO ID first');
      return;
    }
  
    const payload: InitiateFirstPensionBillDTO = {
      ppoId: ppoId,
      toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') as unknown as DateOnly 
    };
  
    this.firstPensionService.generatePdf(payload).subscribe(
      (response) => {
        this.pdfGenerationService.generatePdf(response);
      },
      (error) => {
        console.error('Error generating PDF:', error);
        this.toastService.showError('Error generating PDF');
      }
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

  generateExcel() {
    const payload = {
      "ppoId": 28,
      "ppoNo": "PPO-129823",
      "ppoType": "P",
      "psaType": "A",
      "ppoSubType": "N",
      "ppoCategory": "C",
      "ppoSubCategory": "D",
      "pensionerName": "Jack Dowsel",
      "dateOfBirth": "2024-07-31",
      "gender": "M",
      "mobileNumber": "9794262983",
      "emailId": "string",
      "pensionerAddress": "abc",
      "identificationMark": "S",
      "panNo": "PANNO8941F",
      "aadhaarNo": "868770730351",
      "dateOfRetirement": "2024-07-31",
      "dateOfCommencement": "2024-07-31",
      "basicPensionAmount": 10000,
      "commutedPensionAmount": 2000,
      "enhancePensionAmount": 10000,
      "reducedPensionAmount": 8000,
      "religion": "H"
  };
    this.firstPensionService.generatePdf(JSON.stringify(payload)).subscribe(
      (response) => {
        this.createExcel(response);
      },
      (error) => {
        console.error('Error generating report:', error);
      }
    );
  }

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
