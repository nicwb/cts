import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { NomineeEntryDTO, NomineeResponseDTOJsonAPIResponse, PensionNomineeDetailsService, PensionFactoryService, PensionBankBranchService } from 'src/app/api';
import { catchError, finalize, firstValueFrom, Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';


function convertDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: yyyy-MM-dd
}

@Component({
    selector: 'app-family-nominee',
    templateUrl: './family-nominee.component.html',
    styleUrls: ['./family-nominee.component.scss']
})

export class FamilyNomineeComponent implements OnInit {
    ppoId?: any;
    showFamilyNomineeForm:boolean = false;
    showNomineeDetailsForm:boolean = false;
    //showPensionHolder:boolean = false;
    showFamilyNomineeTable: boolean = false;
    showNomineeDetailsTable: boolean = false;
    // showPensionHolderTable: boolean = false;
    familyNomineeService$?: Observable<any>;
    nomineeDetailsService$?: Observable<any>;
    // pensionHolderService$: Observable<any>;

    // Table suffix identifiers
    readonly FAMILY_NOMINEE_SUFFIX = 'family-nominee';
    readonly NOMINEE_DETAILS_SUFFIX = 'nominee-details';
    // readonly PENSION_HOLDER_SUFFIX = 'pension-holder';
    familyNomineeTableData: any;
    nomineeDetailsTableData: any = { data: [] };
    // pensionHolderTableData: any;

    tableQueryParameters: DynamicTableQueryParameters = {
        pageSize: 10,
        pageIndex: 0,
        filterParameters: [],
        sortParameters: { field: '', order: '' }
    };

    tableActionButton: ActionButtonConfig[] = [];
    tableData: DynamicTable<any> | undefined;
    modalData: any[] = [];

    nomineeDetailsForm: FormGroup = new FormGroup({});
    familyNomineeForm: FormGroup = new FormGroup({});
    // pensionHolderForm: FormGroup = new FormGroup({});
    modelData: any[] = [];
    relationship: SelectItem[]=[];
    relation: SelectItem[]=[];
    nomineeType: SelectItem[]=[];
    share: SelectItem[]=[];
    priorityLevel: SelectItem[]=[];
    valRadio: string = '';
    loading: boolean = false;

    constructor(
    private toastService: ToastService,
    private pensionNomineeDetailsService: PensionNomineeDetailsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pensionFactoryService: PensionFactoryService,
    private pensionBankBranchService: PensionBankBranchService,
    private sessionStorageService: SessionStorageService
    ) {
        // Initialize the service observables
        // this.familyNomineeService$ = new Observable(observer => {
        //     this.loadNominees('A').then(data => {
        //         observer.next(data);
        //         observer.complete();
        //     });
        // });

        // this.nomineeDetailsService$ = new Observable(observer => {
        //     this.loadNominees('B').then(data => {
        //         observer.next(data);
        //         observer.complete();
        //     });
        //     console.log("Nominee Details Observable:", this.nomineeDetailsService$);
        // });

        // this.pensionHolderService$ = new Observable(observer => {
        //     this.loadNominees('C').then(data => {
        //         observer.next(data);
        //         observer.complete();
        //     });
        // });
    }

  @Output() StampCombinationSelected = new EventEmitter<any>();

  ngOnInit(): void {
      this.initializeForm();

      this.route.paramMap.subscribe(params => {
          this.ppoId = params.get('ppoId') || undefined; // Get ppoId from the route parameters
          if (this.ppoId) {
              const ppoidNumber = Number(this.ppoId);
              this.familyNomineeForm.get('ppoId')?.setValue(ppoidNumber);
              this.nomineeDetailsForm.get('ppoId')?.setValue(ppoidNumber);
              //this.pensionHolderForm.get('ppoId')?.setValue(ppoidNumber);
          }
      });


      this.relationship = [
          {label: 'Father', value: {id: '1', name: 'Father', code: 'F'}},
          {label: 'Mother', value: {id: '2', name: 'Mother', code: 'M'}},
          {label: 'Husband', value: {id: '3', name: 'Husband', code: 'H'}},
          {label: 'Wife', value: {id: '4', name: 'Wife', code: 'W'}},
          {label: 'Son', value: {id: '5', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '6', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '7', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '8', name: 'Sister', code: 'T'}},
          {label: 'Self', value: {id: '9', name: 'Self', code: 'E'}},
          {label: 'Brother(Minor)', value: {id: '10', name: 'Brother(Minor)', code: 'I'}},
          {label: 'Sister(Unmarried)', value: {id: '11', name: 'Sister(Unmarried)', code: 'A'}},
          {label: 'Sister(Widowed)', value: {id: '12', name: 'Sister(Widowed)', code: 'C'}},
          {label: 'Other', value: {id: '13', name: 'Other', code: 'O'}}
      ],
      this.relation = [
          {label: 'Father', value: {id: '1', name: 'Father', code: 'F'}},
          {label: 'Mother', value: {id: '2', name: 'Mother', code: 'M'}},
          {label: 'Husband', value: {id: '3', name: 'Husband', code: 'H'}},
          {label: 'Wife', value: {id: '4', name: 'Wife', code: 'W'}},
          {label: 'Son', value: {id: '5', name: 'Son', code: 'S'}},
          {label: 'Daughter', value: {id: '6', name: 'Daughter', code: 'D'}},
          {label: 'Brother', value: {id: '7', name: 'Brother', code: 'B'}},
          {label: 'Sister', value: {id: '8', name: 'Sister', code: 'T'}},
          {label: 'Self', value: {id: '9', name: 'Self', code: 'E'}},
          {label: 'Brother(Minor)', value: {id: '10', name: 'Brother(Minor)', code: 'I'}},
          {label: 'Sister(Unmarried)', value: {id: '11', name: 'Sister(Unmarried)', code: 'A'}},
          {label: 'Sister(Widowed)', value: {id: '12', name: 'Sister(Widowed)', code: 'C'}},
          {label: 'Other', value: {id: '13', name: 'Other', code: 'O'}}
      ],
      this.nomineeType = [
          {label: '5', value: {id: '1', name: '5', code: '5'}},
          {label: '6', value: {id: '2', name: '6', code: '6'}},
          {label: '0', value: {id: '3', name: '0', code: '0'}},
      ],
      this.priorityLevel = [
          {label: '1', value: {id: '1', name: '1', code: 1}},
          {label: '2', value: {id: '2', name: '2', code: 2}},
          {label: '3', value: {id: '3', name: '3', code: 3}},
          {label: '4', value: {id: '4', name: '4', code: 4}},
          {label: '5', value: {id: '5', name: '5', code: 5}},
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
      this.familyNomineeForm = this.fb.group({
          ppoId: [null, Validators.required],
          slNo: ['', Validators.required],
          dependentName: ['', Validators.required],
          relationship: ['', Validators.required],
          dateOfBirthFamilyDetails: ['', Validators.required],
          dateOfDeath: ['', Validators.required],
          identificationMark: ['', Validators.required],
          handicap: ['', Validators.required],
      });

      this.nomineeDetailsForm = this.fb.group({
          ppoId: [null, Validators.required],
          slNo1: ['', Validators.required],
          nomineeName1: ['', Validators.required],
          relation1: ['', Validators.required],
          dateOfBirth1: ['', Validators.required],
          accountNumber1: ['', Validators.required],
          ifscCode1: ['', Validators.required],
          bankBranch1: ['', Validators.required],
          nomineeType1: ['', Validators.required],
          priorityLevel1: ['', Validators.required],
          share1: ['', Validators.required],
          activeFlag: [false, Validators.required]
      });

      //   this.pensionHolderForm = this.fb.group({
      //       ppoId: [null, Validators.required],
      //       slNo2: ['', Validators.required],
      //       nomineeName2: ['', Validators.required],
      //       relation2: ['', Validators.required],
      //       dateOfBirth2: ['', Validators.required],
      //       accountNumber2: ['', Validators.required],
      //       ifscCode2: ['', Validators.required],
      //       bankBranch2: ['', Validators.required],
      //       nomineeType2: ['', Validators.required],
      //       priorityLevel2: ['', Validators.required],
      //       share2: ['', Validators.required],
      //       activeFlag1: [false, Validators.required]
      //   });
  }

  private mapFamilyNomineeToDTO(formData: any): NomineeEntryDTO {
      return {
          dataSource: null,
          ppoId: formData.ppoId,
          serialNo: parseInt(formData.slNo),
          nomineeName: formData.dependentName,
          relation: formData.relationship?.code || '',
          dateOfBirth: formData.dateOfBirthFamilyDetails ? convertDate(formData.dateOfBirthFamilyDetails) : '',
          dateOfDeath: formData.dateOfDeath ? convertDate(formData.dateOfDeath) : undefined,
          identificationMark: formData.identificationMark || null,
          handicapped: formData.handicap === 'True',
          nomineeActive: true,
          nomineeType: null,
          nomineePriority: null,
          nomineeShare: null,
          familyPension: null,
          refused: null,
          bankAcNo: null,
          bankId: undefined,
          branchId: null
      };
  }

  private mapNomineeDetailsToDTO(formData: any): NomineeEntryDTO {
      return {
          dataSource: null,
          ppoId: formData.ppoId,
          serialNo: parseInt(formData.slNo1),
          nomineeName: formData.nomineeName1,
          relation: formData.relation1?.code || '',
          dateOfBirth: formData.dateOfBirth1 ? convertDate(formData.dateOfBirth1) : '',
          nomineeType: formData.nomineeType1?.code || null,
          nomineePriority: formData.priorityLevel1?.id ? parseInt(formData.priorityLevel1.id) : null,
          nomineeShare: formData.share1 ? parseFloat(formData.share1) : null,
          nomineeActive: formData.activeFlag === 'true',
          bankAcNo: formData.accountNumber1,
          bankId: undefined, // Set based on IFSC
          branchId: null, // Set based on branch
          dateOfDeath: undefined,
          handicapped: false,
          identificationMark: null,
          familyPension: null,
          refused: null
      };
  }

  //   private mapPensionHolderToDTO(formData: any): NomineeEntryDTO {
  //       return {
  //           dataSource: null,
  //           ppoId: formData.ppoId,
  //           serialNo: parseInt(formData.slNo2),
  //           nomineeName: formData.nomineeName2,
  //           relation: formData.relation2?.code || '',
  //           dateOfBirth: formData.dateOfBirth2 ? convertDate(formData.dateOfBirth2) : '',
  //           nomineeType: formData.nomineeType2?.code || null,
  //           nomineePriority: formData.priorityLevel2?.id ? parseInt(formData.priorityLevel2.id) : null,
  //           nomineeShare: formData.share2 ? parseFloat(formData.share2) : null,
  //           nomineeActive: formData.activeFlag1 === 'true',
  //           familyPension: true,
  //           bankAcNo: formData.accountNumber2,
  //           bankId: undefined, // Set based on IFSC
  //           branchId: null, // Set based on branch
  //           dateOfDeath: undefined,
  //           handicapped: false,
  //           identificationMark: null,
  //           refused: null
  //       };
  //   }

  async getData(formType: string) {
      if (formType === 'A') {
          this.showFamilyNomineeTable = true; // Show the table for Family Nominee
          this.familyNomineeService$ = this.pensionNomineeDetailsService.getNomineesByPpoId(this.ppoId);
      } else if (formType === 'B') {
          this.showNomineeDetailsTable = true; // Show the table for Nominee Details
          this.nomineeDetailsService$ = this.pensionNomineeDetailsService.getNomineesByPpoId(this.ppoId);
      }
  }

  async fillFactoryDataFirstForm(): Promise<void> {
      try {
          const response = await firstValueFrom(this.pensionFactoryService.createFake('NomineeEntryDTO'));
          if (response.result) {
              const nominee = response.result;
              this.showFamilyNomineeForm = true;
              const dateOfBirth = new Date(nominee.dateOfBirth);
              const dateOfDeath = new Date(nominee.dateOfDeath);
              const relationshipValue = this.relationship.find((item) => item.value.code === nominee.relation);
              this.familyNomineeForm.patchValue({
                  ppoId: this.ppoId,
                  slNo: nominee.serialNo,
                  dependentName: nominee.nomineeName,
                  relationship: relationshipValue?.value,
                  dateOfBirthFamilyDetails: dateOfBirth,
                  dateOfDeath: dateOfDeath,
                  identificationMark: nominee.identificationMark,
                  handicap: nominee.handicapped ? 'True' : 'False'
              });
          }
      } catch (error) {
          this.toastService.showError('Failed to fetch data of Family Nominee.');
      }
  }

  async fillFactoryDataSecondForm(): Promise<void> {
      try {
          const response = await firstValueFrom(this.pensionFactoryService.createFake('NomineeEntryDTO'));
          if (response.result) {
              const nominee = response.result;
              this.showNomineeDetailsForm = true;

              // Ensure nominee data is valid
              const dateOfBirth = new Date(nominee.dateOfBirth);
              const relationshipValue = this.relation.find((item) => item.value.code === nominee.relation);
              const nomineeTypeValue = this.nomineeType.find((item) => item.value.code === nominee.nomineeType);
              const priorityLevelValue = this.priorityLevel.find((item) => item.value.code === nominee.nomineePriority);

              if (nominee.bankId) {
                  const response_branch = await firstValueFrom(this.pensionBankBranchService.getBranchesByBankId(nominee.bankId));
                  const branch = response_branch.result?.branches?.find((branch) => branch.id === nominee.branchId);

                  if (branch) {
                      this.nomineeDetailsForm.patchValue({
                          ppoId: this.ppoId,
                          slNo1: nominee.serialNo,
                          nomineeName1: nominee.nomineeName,
                          relation1: relationshipValue?.value,
                          dateOfBirth1: dateOfBirth,
                          accountNumber1: nominee.bankAcNo,
                          bankBranch1: branch.branchName,
                          ifscCode1: branch.ifscCode,
                          nomineeType1: nomineeTypeValue?.value,
                          priorityLevel1: priorityLevelValue?.value,
                          share1: nominee.nomineeShare,
                          activeFlag: nominee.nomineeActive ? 'true' : 'false'
                      });

                      // Initialize nomineeDetailsTableData if it is undefined
                      if (!this.nomineeDetailsTableData) {
                          this.nomineeDetailsTableData = { data: [] }; // Initialize with an empty array
                      }

                      this.nomineeDetailsTableData.data = [
                          {
                              ...this.nomineeDetailsForm.value,
                              ifscCode: this.nomineeDetailsForm.get('ifscCode1')?.value,
                              bankBranch: this.nomineeDetailsForm.get('bankBranch1')?.value
                          }
                      ];
                  } else {
                      this.toastService.showError('Branch not found.');
                  }
              } else {
                  this.toastService.showError('Bank ID is not defined.');
              }
          } else {
              this.toastService.showError('No data received from the API.');
          }
      } catch (error) {
          console.error('Error fetching nominee details:', error); // Log the error for more details
          this.toastService.showError('Failed to fetch data of Nominee Details.');
      }
  }

  //   async fillFactoryDataThirdForm(): Promise<void> {
  //       try {
  //           const response = await firstValueFrom(this.pensionFactoryService.createFake('NomineeEntryDTO'));
  //           if (response.result) {
  //               const nominee = response.result;
  //               const dateOfBirth = new Date(nominee.dateOfBirth);
  //               const relationshipValue = this.relation.find((item) => item.value.code === nominee.relation);
  //               const nomineeTypeValue = this.nomineeType.find((item) => item.value.code === nominee.nomineeType);
  //               const priorityLevelValue = this.priorityLevel.find((item) => item.value.code === nominee.nomineePriority);
  //               const response_branch = await firstValueFrom(this.pensionBankBranchService.getBranchesByBankId(nominee.bankId));
  //               const branch = response_branch.result?.branches?.find((branch) => branch.id === nominee.branchId);
  //               this.showPensionHolder = true;
  //               if(branch){
  //                   this.pensionHolderForm.patchValue({
  //                       ppoId: this.ppoId,
  //                       slNo2: nominee.serialNo,
  //                       nomineeName2: nominee.nomineeName,
  //                       relation2: relationshipValue?.value,
  //                       dateOfBirth2: dateOfBirth,
  //                       accountNumber2: nominee.bankAcNo,
  //                       bankBranch2: branch.branchName,
  //                       ifscCode2: branch.ifscCode,
  //                       nomineeType2:nomineeTypeValue?.value,
  //                       priorityLevel2: priorityLevelValue?.value,
  //                       share2: nominee.nomineeShare,
  //                       activeFlag1: nominee.nomineeActive ? 'true' : 'false'
  //                   });
  //                   this.pensionHolderTableData.data = [
  //                       {
  //                           ...this.pensionHolderForm.value,
  //                           ifscCode: this.pensionHolderForm.get('ifscCode2')?.value,
  //                           bankBranch: this.pensionHolderForm.get('bankBranch2')?.value
  //                       }
  //                   ];
  //               }

  //           }
  //       } catch (error) {
  //           this.toastService.showError('Failed to fetch PPO receipt details.');
  //       }
  //   }

  async addNominee(nameForm: string): Promise<void> {
      this.loading = true;
      try {
          let nomineeDTO: NomineeEntryDTO;
          let form: FormGroup;

          // Determine which form to process
          switch (nameForm) {
          case 'A':
              form = this.familyNomineeForm;
              if (form.invalid) {
                  this.toastService.showError('Please fill all required fields in Family Nominee Form');
                  this.loading = false;
                  return;
              }
              nomineeDTO = this.mapFamilyNomineeToDTO(form.value);
              break;

          case 'B':
              form = this.nomineeDetailsForm;
              if (form.invalid) {
                  this.toastService.showError('Please fill all required fields in Nominee Details Form');
                  this.loading = false;
                  return;
              }
              nomineeDTO = this.mapNomineeDetailsToDTO(form.value);
              break;

              //   case 'C':
              //     form = this.pensionHolderForm;
              //     if (form.invalid) {
              //       this.toastService.showError('Please fill all required fields in Pension Holder Form');
              //       this.loading = false;
              //       return;
              //     }
              //     nomineeDTO = this.mapPensionHolderToDTO(form.value);
              //     break;

          default:
              this.toastService.showError('Invalid form type');
              this.loading = false;
              return;
          }

          // Call service to register nominee
          const response = await firstValueFrom(
              this.pensionNomineeDetailsService.registerNomineeDetails(nomineeDTO)
                  .pipe(
                      tap((response: NomineeResponseDTOJsonAPIResponse) => {
                          if (response && response.result) {
                              this.toastService.showSuccess(response.message ?? 'Nominee registered successfully');
                              this.resetForm(nameForm);
                              this.getData(nameForm); // Pass form type to load specific data
                          } else {
                              this.toastService.showError('Failed to register nominee: No data received');
                          }
                      }),
                      catchError((error) => {
                          console.error('Error registering nominee:', error);
                          let errorMessage = 'Failed to register nominee';
                          if (error.error?.errors?.length > 0) {
                              errorMessage = error.error.errors[0].detail || errorMessage;
                          }
                          this.toastService.showError(errorMessage);
                          throw error;
                      })
                  )
          );

          // Clear session storage after successful addition
          const suffix = this.getSuffixForForm(nameForm);
          this.sessionStorageService.remove('', '', `DynamicTableComponent_${suffix}`);

          // Refresh the relevant observable
          //await this.refreshTableData(nameForm);

      } catch (error) {
          console.error('Error adding nominee:', error);
          this.toastService.showError('Failed to add nominee');
      } finally {
          this.loading = false;
      }
  }

  private getSuffixForForm(formType: string): string {
      switch (formType) {
      case 'A':
          return this.FAMILY_NOMINEE_SUFFIX;
      case 'B':
          return this.NOMINEE_DETAILS_SUFFIX;
          // case 'C':
          //     return this.PENSION_HOLDER_SUFFIX;
      default:
          return '';
      }
  }

  // private async refreshTableData(formType: string): Promise<void> {
  //     switch (formType) {
  //         case 'A':
  //             this.familyNomineeService$ = new Observable(observer => {
  //                 this.loadNominees('A').then(data => {
  //                     observer.next(data);
  //                     observer.complete();
  //                 });
  //             });
  //             break;
  //         case 'B':
  //             this.nomineeDetailsService$ = new Observable(observer => {
  //                 this.loadNominees('B').then(data => {
  //                     observer.next(data);
  //                     observer.complete();
  //                 });
  //             });
  //             console.log("Nominee Details Observable:", this.nomineeDetailsService$);
  //             break;
  //         case 'C':
  //             this.pensionHolderService$ = new Observable(observer => {
  //                 this.loadNominees('C').then(data => {
  //                     observer.next(data);
  //                     observer.complete();
  //                 });
  //             });
  //             break;
  //     }
  // }

  private resetForm(formType: string): void {
      switch (formType) {
      case 'A':
          this.familyNomineeForm.reset();
          this.showFamilyNomineeForm = false; // Hide form after submission
          break;
      case 'B':
          this.nomineeDetailsForm.reset();
          this.showNomineeDetailsForm = false; // Hide form after submission
          break;
    //   case 'C':
    //       this.pensionHolderForm.reset();
    //       this.showPensionHolder = false; // Hide form after submission
    //       break;
      }
  }

  //   private async loadNominees(formType?: string): Promise<any> {
  //     console.log("FormType", formType);

  //     if (!this.ppoId) {
  //         console.error('PPO ID is not set. Cannot load nominees.');
  //         return []; // Return an empty array instead of null
  //     }

  //     try {
  //         const response = await firstValueFrom(
  //             this.pensionNomineeDetailsService.getNomineesByPpoId(this.ppoId)
  //         );
  //         console.log("response", response);

  //         // Check if the response is valid
  //         if (response && response.apiResponseStatus === "Success") {
  //             const nominees = response.result?.data ?? []; // Ensure this is an array
  //             console.log("Nominee", nominees);

  //             switch (formType) {
  //                 case 'A':
  //                     const familyNominees = nominees.filter(n => n.bankAcNo === null);
  //                     console.log("familyNominee", familyNominees)
  //                     return familyNominees; // Return only the filtered family nominees
  //                 case 'B':
  //                     const otherNominees = nominees.filter(n => n.bankAcNo !== null);
  //                     console.log("otherNominee", otherNominees)
  //                     return otherNominees; // Return only the filtered other nominees
  //                 default:
  //                     return nominees; // Return all nominees if no specific formType
  //             }
  //         } else {
  //             const errorMessage = response?.message || 'Failed to load nominees';
  //             console.log("Error incoming");
  //             this.toastService.showError(errorMessage);
  //             return []; // Return an empty array for error cases
  //         }
  //     } catch (error) {
  //         console.error('Error loading nominees:', error);
  //         console.log("Error 2 incoming");
  //         this.toastService.showError('Failed to load nominees');
  //         return []; // Return an empty array for error cases
  //     }
  // }

  // show and hide forms
  switchFamilyNomineeFrom(){
      this.showFamilyNomineeForm = (!this.showFamilyNomineeForm);
      if(!environment.production){
          this.fillFactoryDataFirstForm();
      }
  }

  switchNomineeDetails(){
      this.showNomineeDetailsForm = (!this.showNomineeDetailsForm);
      if(!environment.production){
          this.fillFactoryDataSecondForm();
      }
  }

  //   switchPensionHolder(){
  //       this.showPensionHolder = (!this.showPensionHolder);
  //       if(!environment.production){
  //           this.fillFactoryDataThirdForm();
  //       }
  //   }

  toggleFamilyNomineeForm() {
      this.showFamilyNomineeForm = !this.showFamilyNomineeForm;
      if (this.showFamilyNomineeForm) {
          if (!environment.production) {
              this.fillFactoryDataFirstForm();
          }
      }
  }

  // Toggle method for Nominee Details Form
  toggleNomineeDetailsForm() {
      this.showNomineeDetailsForm = !this.showNomineeDetailsForm;
      if (this.showNomineeDetailsForm) {
          if (!environment.production) {
              this.fillFactoryDataSecondForm();
          }
      }
  }

  // Toggle method for Family Nominee Table
  toggleFamilyNomineeTable() {
      this.showFamilyNomineeTable = !this.showFamilyNomineeTable;
      if (this.showFamilyNomineeTable) {
          this.getData('A'); // Load data for Family Nominee
      } else {
          this.showFamilyNomineeTable = false; // Hide table
      }
  }

  // Toggle method for Nominee Details Table
  toggleNomineeDetailsTable() {
      this.showNomineeDetailsTable = !this.showNomineeDetailsTable;
      if (this.showNomineeDetailsTable) {
          this.getData('B'); // Load data for Nominee Details
      } else {
          this.showNomineeDetailsTable = false; // Hide table
      }
  }
}