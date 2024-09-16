import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { SelectItem } from 'primeng/api';
import { HoaChain } from 'src/app/core/models/hoa-chain';
import { OnlineBillReceiveService } from 'src/app/core/services/Bill/online-bill-receive.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DatePipe } from '@angular/common';
import { TokenService } from 'src/app/core/services/Token/token.service';
import { NotificationService } from 'src/app/core/services/notification.service';

interface DropDown {
  label: string,
  value: string
}

@Component({
    selector: 'app-online-bill-receive',
    templateUrl: './online-bill-receive.component.html',
    styleUrls: ['./online-bill-receive.component.scss']
})
export class OnlineBillReceiveComponent implements OnInit {
    onlineBill!: FormGroup;
    selectedRefNo: number = 0;
    selectedBillId: number = 0;
    currentDateAndTime: any;
    billtypes: any[] = [
        { name: 'Non Employee', key: 0 },
        { name: 'Employee', key: 1 },
    ];
  
    constructor(private fb: FormBuilder, public onlineBillReceiveService: OnlineBillReceiveService, private toastService: ToastService, private router: Router, private datePipe: DatePipe, private tokenService: TokenService,private notificationService:NotificationService) { }

    // --------------- onclick save button show the value ----------------- 

    tokenList: any | undefined;

    ngOnInit(): void {
        this.onlineBill = this.fb.group({
            ddoCode: ['', Validators.required],
            referenceNo: ['', Validators.required],
            billNo: ['0', Validators.required],
            billdate: ['', Validators.required],
            billType: ['', Validators.required],
            billSubType: ['', Validators.required],
            physicalBillDate: [''],
            ddoCodeNo: ['', Validators.required],
            ddoDesignation: ['', Validators.required],
            payeeDepartment: ['', Validators.required],
            Hoa: ['', Validators.required],
            transferAmount: [''],
            grossAmount: ['', Validators.required],
            netAmount: ['', Validators.required],
            remarks: ['']
        });
        (this.onlineBill.get('ddoCode') as FormControl).disable();
        (this.onlineBill.get('referenceNo') as FormControl).disable();
        (this.onlineBill.get('billNo') as FormControl).disable();
        (this.onlineBill.get('billdate') as FormControl).disable();
        (this.onlineBill.get('billType') as FormControl).disable();
        (this.onlineBill.get('billSubType') as FormControl).disable();
        (this.onlineBill.get('Hoa') as FormControl).disable();
        (this.onlineBill.get('transferAmount') as FormControl).disable();
        (this.onlineBill.get('ddoCodeNo') as FormControl).disable();
        (this.onlineBill.get('ddoDesignation') as FormControl).disable();
        (this.onlineBill.get('payeeDepartment') as FormControl).disable();
        (this.onlineBill.get('grossAmount') as FormControl).disable();
        (this.onlineBill.get('netAmount') as FormControl).disable();
        this.selectedRefNo = this.onlineBillReceiveService.selectedBillRefNo;
        this.selectedBillId = this.onlineBillReceiveService.selectedBillId;
        if (this.selectedRefNo) {
            this.billDetails();
        } else {
            this.toastService.showError("Select a bill first.");
            this.router.navigate(["/bill-receive"]);
        }
        const currentDateTime = new Date();
        this.currentDateAndTime = currentDateTime.getMonth() + '/' + currentDateTime.getDate() + '/' + currentDateTime.getFullYear();
    }
    billDetails() {
        this.onlineBillReceiveService.getBillDetailsByRef(this.selectedRefNo).subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.onlineBill.patchValue(response.result);
                this.onlineBill.patchValue({ ddoCodeNo: response.result.ddoCode });
                this.onlineBill.patchValue({ billdate: response.result.billDate });
                this.onlineBill.patchValue({ physicalBillDate: this.currentDateAndTime });
                const hoa = this.formatHoa(response.result.hoaChain);
                this.onlineBill.patchValue({ Hoa: hoa })
                return;
            }
        })
    }
    // savebilldata() {
    //   console.log(this.onlineBill.value)
    // };

    formSubmit() {
        if (this.onlineBill.valid) {
            const payloadData = {
                billId: this.selectedBillId,
                physicalBillDate:this.datePipe.transform(this.onlineBill.value.physicalBillDate, 'dd/MM/yyyy'),
                remarks: this.onlineBill.value.remarks,
            }
            this.tokenService.generateToken(payloadData).subscribe((res) => {
                if (res.result) {
                    this.onlineBillReceiveService.selectedBillId = 0;
                    this.onlineBillReceiveService.selectedBillRefNo = 0;
                    // this.toastService.showSuccess(res.message+' /n Your Token No is->' +res.result);
                    this.notificationService.success(res.message,"Your Token No is: " +res.result);
                    this.router.navigate(['/bill-receive']);
                    return;
                }
                this.notificationService.error(res.message);
            });

        }else{
            alert('érreo');
        }

    }

    formatHoa(hoa: HoaChain): string {
        return `${hoa.demand}-${hoa.majorHead}-${hoa.subMajorHead}-${hoa.minorHead}-${hoa.schemeHead}-${hoa.votedCharged}-${hoa.detailHead}-${hoa.subDetailHead}`;
    }

}


