import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChequeReceiveListWithMICR } from 'src/app/core/models/cheque';
import { ChequeDistributionService } from 'src/app/core/services/cheque/cheque-distribution.service';
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
    selector: 'app-new-distribution',
    templateUrl: './new-distribution.component.html',
    styleUrls: ['./new-distribution.component.scss']
})
export class NewDistributionComponent implements OnInit {

    distributionForm!: FormGroup;
    cheques!: Chequetype[];
    micrCodeList!: micrcode[];
    selectedMicrCode?: string;
    isVisible: boolean = false;
    isVisibleDetails: boolean = false;
    isShowUserList: boolean = false;
    userList: []=[];
    receivedDetails:ChequeReceiveListWithMICR[]=[];
    selectedUser?: string;
    selectedSeries?: ChequeReceiveListWithMICR;

    constructor(private fb: FormBuilder, private toastService: ToastService, private chequeDistributionService: ChequeDistributionService) { }

    ngOnInit(): void {
        this.cheques = [
            { name: 'Treasury Cheque', code: 1 },
            { name: 'Othres', code: 2 }
        ];
        this.micrCodeList=[
            {name:'1234-1234-1234-1234',code:'1'},
            {name:'2341-3422-44434-2345',code:'1'},
        ]
        // this.userList= [
        //   {name:'User 1',code:'1'},
        //   {name:'User 2',code:'2'},
        //   {name:'User 3',code:'3'},
        // ]
        this.distributionForm = this.fb.group({
            cheques_type: [''],
            // micr_code: [''],
            user_list: [''],
            user_name:['']	
        })
        this.getAllUsers();
        this.getAllReceivedList();
    }

    showMicrList(){
        this.isVisible = !this.isVisible;
    }

    showUserList(){
        this.isShowUserList = !this.isShowUserList
    }

    getAllUsers(){
        this.chequeDistributionService.getUserList().subscribe((response) => {
            if (response.apiResponseStatus == 1) {        
                this.userList = response.result;
            }
        })
    }

    getAllReceivedList(){
        this.chequeDistributionService.getReceivedList().subscribe((response)=>{
            if(response.apiResponseStatus == 1){
                this.receivedDetails = response.result;
                console.log('---->',this.receivedDetails);
        
            }
        })
    }

    showDetails(){
        this.isVisibleDetails = true;
    }

}
