import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';



import { Output, EventEmitter } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { SharedDataService } from './shared-data.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Payload } from 'src/app/core/models/search-query';
import { SearchPopupComponent, SearchPopupConfig } from 'src/app/core/search-popup/search-popup.component';

import { PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse, PensionPPODetailsService } from 'src/app/api';
import { Observable } from 'rxjs';


interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-ppodetails',
  templateUrl: './ppodetails.component.html',
  styleUrls: ['./ppodetails.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})

export class PpodetailsComponent implements OnInit{
  currentStepIndex: number = 0;
  steps: any[];
  isFormValid:boolean=false;
  ppoID?:string;
  ref: DynamicDialogRef | undefined;

  allPPOs$?:Observable<PensionerListItemDTOIEnumerableDynamicListResultJsonAPIResponse>;

  constructor(
    private toastService: ToastService,
    private sd: SharedDataService,
    private dialogService: DialogService,
    private ppoDetialsService: PensionPPODetailsService,
  ){
    this.steps = [
            { label: 'PPO Details' },
            { label: 'Bank Details' },
            { label: 'Sanction Details'},
            { label: 'Family Nominee'}
    ];
  }
  ngOnInit(): void {
    // add for detect changes in form valid or not
    this.sd.isFormValid$.subscribe(status => {
      this.isFormValid = status;
    });

    this.sd.ppoID$.subscribe(status => {
      this.ppoID = status;
    });

  }

  next_move(){
    // if alrady ppo id exists make forward else save data and do it
    if(this.ppoID != undefined || this.ppoID != null) {
      this.currentStepIndex++;
    }
  }

  next() {
    
    if (this.sd.object != undefined) {
       // universal function for all sub components
       if(this.sd.object.saveData() == true){
          this.next_move();
       }
    }else{
      this.next_move();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }
  // fetch ppoid if exists
  fetchPPOID(): void {
      console.log("Fetching ppoid")
      let payload:Payload = {
        "pageSize":10,
        "pageIndex":0,
        "filterParameters": [],
        "sortParameters":{
          "field":"",
          "order":""
        }
      };
      
      this.allPPOs$ = this.ppoDetialsService.getAllPensioners(payload);

      this.ref = this.dialogService.open(SearchPopupComponent, {
        data: this.allPPOs$,
        header: 'Search record',
        width: '60%'
      });

      this.ref.onClose.subscribe((record: any) => {
        if (record) {
          this.sd.setPPOID(record.ppoId);
          this.next();
        }
      });
  }
}

// export class PpodetailsComponent implements OnInit {

//   ppoForm: FormGroup = new FormGroup({});
//   religionOptions: SelectItem[];
//   subDivOptions: SelectItem[];
//   isNextButtonDisabled: boolean = true;
//   currentStepIndex: number = 0;
//   steps: any[];
//   ppoSanctionForm!: FormGroup;
//   genders: SelectItem[]=[];

//   // start
//   showFamilyNomineeFrom:boolean = false;
//   showNomineeDetailsFrom:boolean = false;
//   showPensionHolder:boolean = false;
  
//   tableQueryParameters: DynamicTableQueryParameters = {
//     pageSize: 10,
//     pageIndex: 0,
//     filterParameters: [], 
//     sortParameters: { field: '', order: '' } 
//   };

//   tableActionButton: ActionButtonConfig[] = [];

//   tableData: DynamicTable<GetStampIndents> | undefined;
//   modalData: any[] = []; 

//   nomineeDetailsForm: FormGroup = new FormGroup({});
//   familyNomineeForm: FormGroup = new FormGroup({});
  
//   expandedRows: expandedRows = {};
//   modelData: any[] = []; 
//   relationship: SelectItem[]=[];
//   relation: SelectItem[]=[];
//   nomineeType: SelectItem[]=[];
//   share: SelectItem[]=[];
//   priorityLevel: SelectItem[]=[];
//   valRadio: string = '';
//   // end


//   constructor(private fb: FormBuilder, private router: Router, private toastService: ToastService,
//     private stampIndentService: StampIndentService) {
//     this.ininalizer();

//     this.religionOptions = [
//       { label: 'Hindu', value: 'hindu' },
//       { label: 'Muslim', value: 'muslim' },
//       { label: 'Christian', value: 'christian' },
//       { label: 'Other', value: 'other' }
//     ];

//     this.subDivOptions = [
//       { label: 'Sub Div 1', value: 'subDiv1' },
//       { label: 'Sub Div 2', value: 'subDiv2' },
//       { label: 'Sub Div 3', value: 'subDiv3' }
//     ];

//     this.steps = [
//       { label: 'PPO Details' },
//       { label: 'Bank Details' },
//       { label: 'Sanction Details'},
//       { label: 'Family Nominee'}
//     ];

//     this.genders = [
//       { label: 'Male', value: { id: 1, name: 'Male', code: 'M' } },
//       { label: 'Female', value: { id: 2, name: 'Female', code: 'F' } },
//       { label: 'Transgender', value: { id: 3, name: 'Transgender', code: 'T' } },
//   ];
//   }
//   @Output() StampCombinationSelected = new EventEmitter<any>();

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getAllStampIndents();

//     this.relationship = [
//       {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
//       {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
//       {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
//       {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
//     ],
    
//     this.relation = [
//       {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
//       {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
//       {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
//       {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
//     ],

//     this.nomineeType = [
//       {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
//       {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
//       {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
//       {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
//     ],

//     this.share = [
//       {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
//       {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
//       {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
//       {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
//     ],
    
//     this.priorityLevel = [
//       {label: 'High', value: {id: '1', name: 'High', code: 'H'}},
//       {label: 'Medium', value: {id: '2', name: 'Medium', code: 'M'}},
//       {label: 'Low', value: {id: '3', name: 'Low', code: 'L'}},
//     ]
//   }
  
//   ininalizer(): void {
//     this.ppoForm = this.fb.group({
//       transferredPpoNo: [''],
//       ePpoSearchDetails: [''],
//       pensionerStatus: [''],
//       ppoApprovalFlag: [''],
//       ppoApproveDate: [''],
//       ppoId: [''],
//       ppoNo: [''],
//       pensionerName: [''],
//       subType: [''],
//       catDescription: [''],
//       commencementDate: [''],
//       notionalBasicPension: [''],
//       withEffectiveDate: [''],
//       reducedPension: [''],
//       effectiveDate: [''],
//       commutedPension: [''],
//       upto: [''],
//       familyPension: [''],
//       payMode: [''],
//       bankBranchName: [''],
//       accountNo: [''],
//       accountHolder: [''],
//       ifscCode: [''],
//       religion: [''], 
//       firstPensionGenerated: [''],
//       panNo: [''],
//       mobileNo: [''],
//       aadharNo: [''],
//       healthScheme: [''],
//       gpfTpfNo: [''],
//       subDiv: [''], 
//       doublePension: [false],
//       employedPensioner: [''],
//       reEmployed: [''],
//       address: [''],
//       remarks: [''],
//       adhocPension: [false],
//       provisionalPension: [false],
//       interimAllowance: [false],
//       sharedPension: [false],
//       valRadio: [''],
//       type: [''],
//       catSubCatid: [''],
//       retirementDate: [''],
//       basic: [''],
//       dateOfDeath: [''],
//       epf: [''],
//       PpoId: ['', Validators.required],
//       nameOfServiceHolder: ['', Validators.required],
//       sanctionAuthority: ['', Validators.required],
//       sanctionNo: ['', Validators.required],
//       sanctionDate: ['', Validators.required],
//       dateOfBirth: ['', Validators.required],
//       gender: ['',Validators.required],
//       dateOfAppointment: ['', Validators.required],
//       officeName: ['', Validators.required],
//       postHeld: ['',Validators.required],
//       lastPay: ['',Validators.required],
//       averageAmolument:['',Validators.required],
//       hrmsUniqueIdOfServiceHolder: ['',Validators.required],
//       issuingAuthority: ['',Validators.required],
//       letterNo: ['',Validators.required],
//       letterDate: ['',Validators.required],
//       grossYear: ['',Validators.required],
//       grossMonth: ['',Validators.required],
//       grossDay: ['',Validators.required],
//       netYear: ['',Validators.required],
//       netMonth: ['',Validators.required],
//       netDay: ['',Validators.required],
//     });

//   }


//   handlePrintData() {
//     console.log(this.ppoForm.value);
//   }


//   onSearch() {
//     if (this.ppoForm.valid) {
//       //logic
//       console.log('Form Submitted', this.ppoForm.value);
//     }
//   }

//   saveData() {
//     console.log('Data Saved', this.ppoForm.value);
//   }

//   next() {
//     this.currentStepIndex++;
//   }

//   prev() {
//     if (this.currentStepIndex > 0) {
//       this.currentStepIndex--;
//     }
//   }

//   handleButtonClick($event: any): void {
//     if ($event && $event.buttonType === 'customButton') {
//       console.log('Custom button clicked!');
//     } else {
//       console.log('Unhandled button click event');
//       this.modalData = [this.familyNomineeForm.value];
       
//     }
//   }

//   initializeForm(): void {
    
//     // for form A
//     this.familyNomineeForm = this.fb.group({
//           slNo: ['', Validators.required],  
//           dependentName: ['', Validators.required],
//           relationship: ['', Validators.required],
//           dateOfBirthFamilyDetails: ['', Validators.required],
//           dateOfDeath: ['', Validators.required],
//           identificationMark: ['', Validators.required],
//           handicap: ['', Validators.required],
//     });


//   }

//   addStampIndent(nameForm:string) {
//     switch(nameForm){
//       case 'A':
//         this.switchFamilyNomineeFrom();
//         this.modalData = [this.familyNomineeForm.value];  
//         console.log(this.modalData.length);
//         break;

//       case 'B':
//           this.switchNomineeDetails();
//           this.modalData = [this.familyNomineeForm.value];  
//           console.log(this.modalData.length);
//           break;

//       case 'C':
//           this.switchPensionHolder();
//           this.modalData = [this.familyNomineeForm.value];  
//           console.log(this.modalData.length);
//           break;
          
//       default:
//         console.log('Invalid form name');
//         return;
//     }
//   }

//   getAllStampIndents() {
//     this.stampIndentService.getAllStampIndents(this.tableQueryParameters)
//       .subscribe((response) => {
//         if (response.apiResponseStatus === 1) {
//           response.result.data.forEach((item: GetStampIndents) => {
//             item.createdAt = convertDate(item.createdAt);
//             item.memoDate = convertDate(item.memoDate);
//             item.status = Status[item.status as keyof typeof Status].toString();
//           });
//           this.tableData = response.result;
//         } else {
//           this.toastService.showAlert(response.message, response.apiResponseStatus);
//         }
//       });
//   }


//   // show and hide forms
//   switchFamilyNomineeFrom(){
//     this.showFamilyNomineeFrom = (!this.showFamilyNomineeFrom);
//   }

//   switchNomineeDetails(){
//     this.showNomineeDetailsFrom = (!this.showNomineeDetailsFrom);
//   }

//   switchPensionHolder(){
//     this.showPensionHolder = (!this.showPensionHolder);
//   }
// }
