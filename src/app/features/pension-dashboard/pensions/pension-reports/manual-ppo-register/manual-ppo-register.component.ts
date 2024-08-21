import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ManualPpoRegisterService } from 'src/app/core/services/manualPpoRegister/manual-ppo-register.service';
import { ToastService } from 'src/app/core/services/toast.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-manual-ppo-register',
  templateUrl: './manual-ppo-register.component.html',
  styleUrls: ['./manual-ppo-register.component.scss']
})
export class ManualPpoRegisterComponent implements OnInit {
  ManualPpoRegisterForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private manualPpoRegisterService: ManualPpoRegisterService
  ) {}

  ngOnInit(): void {
    this.ManualPpoRegisterForm = this.fb.group({
      generation: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator: ValidatorFn = (formGroup: AbstractControl): { [key: string]: any } | null => {
    const fromDate = formGroup.get('fromDate')?.value;
    const toDate = formGroup.get('toDate')?.value;
    const generation = formGroup.get('generation')?.value;

    return fromDate && toDate && generation ? null : { 'invalidForm': true };
  };

  onRefresh(): void {
    this.ManualPpoRegisterForm.reset();
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

    this.manualPpoRegisterService.generateManualPpoRegister(JSON.stringify(payload)).subscribe(
      (response) => {
        this.createPDF(response);
      },
      (error) => {
        console.error('Error generating report:', error);
      }
    );
  }

  createPDF(data: any) {
    const doc = new jsPDF();
    const formValues = this.ManualPpoRegisterForm.value;

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
    this.manualPpoRegisterService.generateManualPpoRegister(JSON.stringify(payload)).subscribe(
      (response) => {
        this.createExcel(response);
      },
      (error) => {
        console.error('Error generating report:', error);
      }
    );
  }

  createExcel(data: any) {
    const formValues = this.ManualPpoRegisterForm.value;
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
}
