import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ChequeReceive, ChequeReceiveListWithMICR, NewChequeEntry, saveChequeDistributionData } from 'src/app/core/models/cheque';
import {
    ActionButtonConfig,
    DynamicTable,
    DynamicTableQueryParameters,
} from 'src/app/core/models/dynamic-table';
import { ChequeDistributionService } from 'src/app/core/services/cheque/cheque-distribution.service';
import { ChequeInvoiceService } from 'src/app/core/services/cheque/cheque-invoice.service';
import { ToastService } from 'src/app/core/services/toast.service';


interface Chequetype {
  name: string;
  code: Number;
}
interface micrcode {
  name: string,
  code: string
}

interface users {
  name: string,
  code: string
}
@Component({
    selector: 'app-cheque-distribution',
    templateUrl: './cheque-distribution.component.html',
    styleUrls: ['./cheque-distribution.component.scss']
})
export class ChequeDistributionComponent implements OnInit {
    displayModal: boolean | undefined;
    tableData!: DynamicTable<ChequeReceive>;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig<ChequeReceive>[] = [];

    distributionForm!: FormGroup;
    cheques!: Chequetype[];
    micrCodeList!: micrcode[];
    selectedMicrCode?: string;
    isVisible: boolean = false;
    isVisibleDetails: boolean = false;
    isShowUserList: boolean = false;
    userList: [] = [];
    receivedDetails: ChequeReceiveListWithMICR[] = [];
    selectedUser?: string;
    selectedSeries: ChequeReceiveListWithMICR[]=[];
    micrList!: [];
    distributeFormDetailsData!:saveChequeDistributionData;

    constructor(private chequedistributionService: ChequeDistributionService, private fb: FormBuilder, private chequeinvoiceservice: ChequeInvoiceService,  private toastService: ToastService,) { }

    ngOnInit(): void {
        this.cheques = [
            { name: 'Treasury Cheque', code: 1 },
            { name: 'Othres', code: 2 }
        ];
        this.tableActionButton = [
            {
                buttonIdentifier: 'cheque_distribute',
                class: '"p-button-raised p-button-rounded',
                icon: 'pi pi-check-circle',
                lable: 'Cheque Distribute',
            },
        ];

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.getTableData();

        this.distributionForm = this.fb.group({
            cheques_type: [''],
            micr_code:[''],
            series: [''],
            userListDetails: this.fb.array([this.createUserListDetail()]),
        });
        this.getAllUsers();
        this.getAllReceivedList();
        this.getMicrList('BAA');

    }

    showModal() {
        this.displayModal = true;
    }

    getTableData() {
        this.chequedistributionService.getChqueListForDistribution(this.tableQueryParameters).subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.tableData = response.result;
            }
        });
    }

    showUserList() {
        this.isShowUserList = !this.isShowUserList
    }

    getAllUsers() {
        this.chequedistributionService.getUserList().subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.userList = response.result;
                console.log('--->>>',this.userList);
        
            }
        })
    }

    getAllReceivedList() {
        this.chequedistributionService.getReceivedList().subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.receivedDetails = response.result;

            }
        })
    }

    getMicrList(treasurieCode: string) {
        console.log(treasurieCode);
    
        this.chequeinvoiceservice.getAvailableChequeMIcr(treasurieCode).subscribe((res) => {
            if (res.apiResponseStatus == 1) {
                this.micrList = res.result;
            } else {
                this.toastService.showError(res.message);
            }
        });
    }

    showDetails() {
        this.isVisibleDetails = true;
    }
    get userListDetailsFormArray(): FormArray{
        return this.distributionForm.get('userListDetails') as FormArray
    }

    createUserListDetail(): FormGroup {
        return this.fb.group({
            userId: [''],
            // start: [''],
            // end: [''],
            quantity: ['']
        });
    }

    addUserList() {
        this.userListDetailsFormArray.push(this.createUserListDetail());
    }

    removeUserList(index:number){
        this.userListDetailsFormArray.removeAt(index);
    }

    calculateQuantity(): void {
        const start = this.distributionForm.get('start')?.value;
        const end = this.distributionForm.get('end')?.value;
        console.log('my-start-end',start, end);
    
    // if (start && end && !isNaN(start) && !isNaN(end)) {
    //   const quantity = (parseInt(end, 10) - parseInt(start, 10)) + 1;
    //   this.distributionForm.get('quantity')?.setValue(quantity > 0 ? quantity : 0);
    // } else {
    //   this.distributionForm.get('quantity')?.setValue(0);
    // }
    }
    submitDistributionFrm() {
        this.distributeFormDetailsData ={
            micrCode: this.distributionForm.value.micr_code,
            series: this.distributionForm.value.series,
            distributor: "BAA",
            chequeInvoiceDetailsid: 135,
            chequeDistributeToUse: this.distributionForm.value.userListDetails
        }
        this.chequedistributionService.saveChequeDistribution(this.distributeFormDetailsData).subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.toastService.showSuccess(response.message);
            }
        })
        console.log('hi form',this.distributionForm.value);
    }


}
