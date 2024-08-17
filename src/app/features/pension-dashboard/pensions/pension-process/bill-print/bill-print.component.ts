import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BillPrintService } from 'src/app/core/services/bill-print/bill-print.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { FileGenerationBillPrintService } from 'src/app/core/services/File_Generation_Bill_Print/file-generation-bill-print.service';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.scss']
})
export class BillPrintComponent implements OnInit {
  
BillPrintForm: FormGroup = new FormGroup({});
months: SelectItem[] = [];
loading!: boolean;


constructor(private fb: FormBuilder, private toastService: ToastService, private billPrintService: BillPrintService ,private fileGeneration: FileGenerationBillPrintService) {
  
 }

 
ngOnInit(): void {
  this.BillPrintForm = this.fb.group({
    choices: [''],
    months: ['', Validators.required],
    year: [new Date(), Validators.required],
    bank: ['', Validators.required],
    category: ['', Validators.required]
    
  });
  this.months = [
    { label: 'January', value: { id: 1, name: 'January', code: 'Jan' } },
    { label: 'February', value: { id: 2, name: 'February', code: 'Feb' } },
    { label: 'March', value: { id: 3, name: 'March', code: 'March' } },
    { label: 'April', value: { id: 4, name: 'April', code: 'April' } },
    { label: 'May', value: { id: 5, name: 'May', code: 'May' } },
    { label: 'June', value: { id: 6, name: 'June', code: 'June' } },
    { label: 'July', value: { id: 7, name: 'July', code: 'July' } },
    { label: 'August', value: { id: 8, name: 'August', code: 'Aug' } },
    { label: 'September', value: { id: 9, name: 'September', code: 'Sep' } },
    { label: 'October', value: { id: 10, name: 'October', code: 'Oct' } },
    { label: 'November', value: { id: 11, name: 'November', code: 'Nov' } },
    { label: 'December', value: { id: 12, name: 'December', code: 'Dec' } }
];

  this.BillPrintForm.get('choices')?.valueChanges.subscribe(value => {
    if (this.showBankInput()) {
        this.BillPrintForm.get('bank')?.enable();
    } else {
        this.BillPrintForm.get('bank')?.disable();
    }

    if (this.showCategoryInput()) {
        this.BillPrintForm.get('category')?.enable();
    } else {
        this.BillPrintForm.get('category')?.disable();
    }
});
}

onYearSelect(event: Date) {
  const selectedYear = event.getFullYear();
  this.BillPrintForm.patchValue({
    year: new Date(selectedYear, 0, 1)
  });
}

onRefresh(): void{
  this.BillPrintForm.reset();
}

onGenerate(generation: string) {
  if (this.BillPrintForm.valid) {
    const formValue = this.BillPrintForm.value;
    //console.log(formValue);
    
    // 
    const reportData = {
      bank: 'ALLAHABAD BANK-RATUA',
      category: 'Education Pension',
      billNumber: '283',
      voucherNumber: '2071320',
      total: '322495',
      netAmount: '322495',
      payAmount: '322495',
      amountInWords: 'Three Lakh Twenty Two Thousand Four Hundred Ninety Five Only',
      details: [
        { ppoId: '7338', ppoNumber: 'MLD/S/5/050', pensionerName: 'SMT BIBI AMINA', bankAccountNo: '501814147278', totalPayable: '9850', basicPension: '8500', dr: '850', mr: '500', commutedAmount: '0', overdrawal: '0', dp: '0', additionalPension: '0', arrear: '0', ir: '0', byTransfer: '0' },
        { ppoId: '11086', ppoNumber: 'MLD/S/6/052', pensionerName: 'NURNEHAR KHATUNBEWA', bankAccountNo: '50181417176', totalPayable: '11050', basicPension: '1550', dr: '1550', mr: '500', commutedAmount: '0', overdrawal: '0', dp: '0', additionalPension: '0', arrear: '0', ir: '0', byTransfer: '0' },
        { ppoId: '11742', ppoNumber: 'MLD/S/7/003', pensionerName: 'MDGOLIM RASUL', bankAccountNo: '501813654176', totalPayable: '17417', basicPension: '15550', dr: '1550', mr: '500', commutedAmount: '0', overdrawal: '0', dp: '0', additionalPension: '0', arrear: '0', ir: '0', byTransfer: '0' },
        { ppoId: '12319', ppoNumber: 'MLD/S/7/004', pensionerName: 'MDTAYEB ALI', bankAccountNo: '50181451876', totalPayable: '20617', basicPension: '17550', dr: '1750', mr: '500', commutedAmount: '0', overdrawal: '0', dp: '0', additionalPension: '0', arrear: '0', ir: '0', byTransfer: '0' },
        { ppoId: '12630', ppoNumber: 'MLD/S/8/005', pensionerName: 'MDABDUL HASSAN', bankAccountNo: '50181421784', totalPayable: '10958', basicPension: '9500', dr: '950', mr: '508', commutedAmount: '0', overdrawal: '0', dp: '0', additionalPension: '0', arrear: '0', ir: '0', byTransfer: '0' }
      ]
    };
    
    

    this.loading = true; 

    try {
      switch (formValue.choices) {
        case 'all':
          this.generateAllReport(reportData);
          break;
        case 'allBankSpecificCategory':
          this.generateAllBankSpecificCategoryReport(reportData);
          break;
        case 'specificBackAllCategory':
          this.generateSpecificBankAllCategoryReport(reportData);
          break;
        case 'specificBankSpecificCategory':
          this.generateSpecificBankSpecificCategoryReport(reportData);
          break;
        default:
          throw new Error('Invalid choice selected');
      }
      this.fileGeneration.generatePdf(reportData);
    } catch (error) {
      console.error('Error generating report', error);
    } finally {
      this.loading = false; 
    }
  } else {
    console.error('Form is invalid');
  }
}

private generateAllReport(data: any) {
  console.log('Generating report for all banks and all categories: ', data);
}

private generateAllBankSpecificCategoryReport(data: any) {
  console.log('Generating report for all banks and specific category', data);
}

private generateSpecificBankAllCategoryReport(data: any) {
  console.log('Generating report for specific bank and all categories', data);
}

private generateSpecificBankSpecificCategoryReport(data: any) {
  console.log('Generating report for specific bank and specific category', data);
}


showBankInput(): boolean {
  const choices = this.BillPrintForm.get('choices')?.value;
  return choices === 'specificBackAllCategory' || choices === 'specificBankSpecificCategory';
}

showCategoryInput(): boolean {
  const choices = this.BillPrintForm.get('choices')?.value;
  return choices === 'allBankSpecificCategory' || choices === 'specificBankSpecificCategory';
}
}