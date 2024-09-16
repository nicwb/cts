import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { SelectItem } from 'primeng/api';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { AddStampIndent, GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';


interface expandedRows {
  [key: string]: boolean;
}

@Component({
    selector: 'app-family-nominee',
    templateUrl: './family-nominee.component.html',
    styleUrls: ['./family-nominee.component.scss']
})

export class FamilyNomineeComponent implements OnInit {
    showFamilyNomineeFrom:boolean = false;
    showNomineeDetailsFrom:boolean = false;
    showPensionHolder:boolean = false;

    tableQueryParameters: DynamicTableQueryParameters = {
        pageSize: 10,
        pageIndex: 0,
        filterParameters: [], 
        sortParameters: { field: '', order: '' } 
    };

    tableActionButton: ActionButtonConfig[] = [];

    tableData: DynamicTable<GetStampIndents> | undefined;
    modalData: any[] = []; 

    nomineeDetailsForm: FormGroup = new FormGroup({});
    familyNomineeForm: FormGroup = new FormGroup({});
  
    expandedRows: expandedRows = {};
    modelData: any[] = []; 
    relationship: SelectItem[]=[];
    relation: SelectItem[]=[];
    nomineeType: SelectItem[]=[];
    share: SelectItem[]=[];
    priorityLevel: SelectItem[]=[];
    valRadio: string = '';

    constructor(
    private toastService: ToastService,
    private stampIndentService: StampIndentService,
    private fb: FormBuilder
    ) { }

  @Output() StampCombinationSelected = new EventEmitter<any>();

  ngOnInit(): void {
      this.initializeForm();
      this.getAllStampIndents();

      this.relationship = [
          {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
      ],
      this.relation = [
          {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
      ],
      this.nomineeType = [
          {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
      ],
      this.share = [
          {label: 'Son', value: {id: '1', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '2', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '3', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '4', name: 'Sister', code: 'S'}},
      ],
      this.priorityLevel = [
          {label: 'High', value: {id: '1', name: 'High', code: 'H'}},
          {label: 'Medium', value: {id: '2', name: 'Medium', code: 'M'}},
          {label: 'Low', value: {id: '3', name: 'Low', code: 'L'}},
      ]
  }


  handleButtonClick($event: any): void {
      if ($event && $event.buttonType === 'customButton') {
          console.log('Custom button clicked!');
      } else {
          console.log('Unhandled button click event');
          this.modalData = [this.familyNomineeForm.value];
       
      }
  }

  initializeForm(): void {
    
      // for form A
      this.familyNomineeForm = this.fb.group({
          slNo: ['', Validators.required],  
          dependentName: ['', Validators.required],
          relationship: ['', Validators.required],
          dateOfBirthFamilyDetails: ['', Validators.required],
          dateOfDeath: ['', Validators.required],
          identificationMark: ['', Validators.required],
          handicap: ['', Validators.required],
      });


  }

  addStampIndent(nameForm:string) {
      switch(nameForm){
      case 'A':
          this.switchFamilyNomineeFrom();
          this.modalData = [this.familyNomineeForm.value];  
          console.log(this.modalData.length);
          break;

      case 'B':
          this.switchNomineeDetails();
          this.modalData = [this.familyNomineeForm.value];  
          console.log(this.modalData.length);
          break;

      case 'C':
          this.switchPensionHolder();
          this.modalData = [this.familyNomineeForm.value];  
          console.log(this.modalData.length);
          break;
          
      default:
          console.log('Invalid form name');
          return;
      }
  }

  getAllStampIndents() {
      this.stampIndentService.getAllStampIndents(this.tableQueryParameters)
          .subscribe((response) => {
              if (response.apiResponseStatus === 1) {
                  response.result.data.forEach((item: GetStampIndents) => {
                      item.createdAt = convertDate(item.createdAt);
                      item.memoDate = convertDate(item.memoDate);
                      item.status = Status[item.status as keyof typeof Status].toString();
                  });
                  this.tableData = response.result;
              } else {
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              }
          });
  }


  // show and hide forms
  switchFamilyNomineeFrom(){
      this.showFamilyNomineeFrom = (!this.showFamilyNomineeFrom);
  }

  switchNomineeDetails(){
      this.showNomineeDetailsFrom = (!this.showNomineeDetailsFrom);
  }

  switchPensionHolder(){
      this.showPensionHolder = (!this.showPensionHolder);
  }
}