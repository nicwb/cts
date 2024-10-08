import { APIResponseStatus, PensionCategoryMasterService } from 'src/app/api';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    ActionButtonConfig,
    DynamicTableQueryParameters,
} from 'mh-prime-dynamic-table';

import { ToastService } from 'src/app/core/services/toast.service';
import { SelectItem } from 'primeng/api';
import { PensionCategoryDetails } from 'src/app/core/models/pension-category-details';
import { Observable, filter, firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { pathToFileURL } from 'url';
import {Location} from '@angular/common';
interface expandedRows {
    [key: string]: boolean;
}
@Component({
    selector: 'app-pension-category',
    templateUrl: './pension-category.component.html',
    styleUrls: ['./pension-category.component.scss'],
})
export class PensionCategoryComponent implements OnInit {
    expandedRows: expandedRows = {};
    displayInsertModal: boolean = false;
    PensionForm!: FormGroup;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    tableActionButton: ActionButtonConfig[] = [];
    tableChildActionButton: ActionButtonConfig[] = [];
    tableData: any;
    modalData: PensionCategoryDetails[] = [];
    count: number = 0;
    isTableDataLoading: boolean = false;
    treasuryReceiptId!: string;
    manaualPensionPayload!: PensionCategoryDetails;
    selectedRowData: PensionCategoryDetails | null = null;
    selectedRow: any;
    PensionOption: SelectItem[] = [];
    primary_id_select: SelectItem[] = [];
    sub_id_select: SelectItem[] = [];
    rowData: any;
    refresh_b = false;
    primary_id!: any;
    sub_id!: any;
    searching = {
        val: false,
        data: null,
    };
    primary_table = false;
    sub_table = false;
    isTableVisible: boolean = false;

    primary_from_url!: String;
    sub_from_url!: string;
    @ViewChild('subFilterSearch', { static: false }) dropdownRef!: ElementRef;

    constructor(
        // private datePipe: DatePipe,
        private toastService: ToastService,
        private service: PensionCategoryMasterService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    @Output() PensionCategorySelected = new EventEmitter<any>();

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        this.initializeForm();
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.check_for_data();
        const endpoint = this.route.snapshot.url.map(segment => segment.path).join('/');
        if(endpoint == 'app-pension-category/new'){
            this.showInsertDialog();
        }
    }

    showInsertDialog() {
        this.displayInsertModal = true;
        this.isTableVisible = false;
    }

    handleRowSelection($event: any) {
        console.log('Row selected:', $event);
    }

    handQueryParameterChange(event: any) {
        console.log('Query parameter changed:', event);
        if (this.searching.val == true) {
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: [
                    {
                        field: 'CategoryName',
                        value: this.searching.data,
                        operator: 'contains',
                    },
                ],
                sortParameters: event.sortParameters,
            };
        } else {
            this.tableQueryParameters = {
                pageSize: event.pageSize,
                pageIndex: event.pageIndex / 10,
                filterParameters: event.filterParameters || [],
                sortParameters: event.sortParameters,
            };
        }

        // this.getData();
    }
    async check_for_data() {
        let primary;
        let sub;
        this.route.queryParams.subscribe((params) => {
            primary = params['primary'];
            sub = params['sub'];
        });
        console.log(primary, sub);
        if (primary && sub) {
            this.primary_from_url = primary;
            this.sub_from_url = sub;
            let dataP = {
                pageSize: 1,
                pageIndex: 0,
                filterParameters: [
                    {
                        field: 'PrimaryCategoryName',
                        value: primary,
                        operator: 'contains',
                    },
                ],
            };
            let response = await firstValueFrom(
                this.service.getAllPrimaryCategories(dataP)
            );
            this.PensionForm.patchValue({
                PrimaryCategoryId: response.result?.data?.[0]?.id,
            });
            if (response.result && response.result.data) {
                let value = response.result.data;
                if (value.length != 0) {
                    let len_val = value.length;
                    this.primary_id_select = [];
                    for (let i = 0; i < len_val; i++) {
                        this.primary_id_select.push({
                            label: `${value[i].id}-${value[i].primaryCategoryName}`,
                            value: value[i].id,
                        });
                    }
                } else {
                    this.toastService.showError('Could Not Found');
                }
            }
            this.primary_id = this.primary_id_select.find(
                (val) =>
                    val.label ==
                    `${response.result?.data?.[0]?.id}-${response.result?.data?.[0]?.primaryCategoryName}`
            );

            this.displayInsertModal = true;

            let dataS = {
                pageSize: 1,
                pageIndex: 0,
                filterParameters: [
                    {
                        field: 'SubCategoryName',
                        value: sub,
                        operator: 'contains',
                    },
                ],
            };

            let responseS = await firstValueFrom(
                this.service.getAllSubCategories(dataS)
            );
            this.PensionForm.patchValue({
                PrimaryCategoryId: responseS.result?.data?.[0]?.id,
            });
            if (responseS.result && responseS.result.data) {
                let value = responseS.result.data;
                if (value.length != 0) {
                    let len_val = value.length;
                    this.sub_id_select = [];
                    for (let i = 0; i < len_val; i++) {
                        this.sub_id_select.push({
                            label: `${value[i].id}-${value[i].subCategoryName}`,
                            value: value[i].id,
                        });
                    }
                } else {
                    this.toastService.showError('Could Not Found');
                }
            }
            this.sub_id = this.sub_id_select.find(
                (val) =>
                    val.label ==
                    `${responseS.result?.data?.[0]?.id}-${responseS.result?.data?.[0]?.subCategoryName}`
            );

            this.displayInsertModal = true;
            let value_for_patch = {
                PrimaryCategoryId: this.primary_id.value,
                SubCategoryId: this.sub_id.value, // Fixed the error here
            };
            this.PensionForm.patchValue(value_for_patch);
        } else if (primary) {
            this.primary_from_url = primary;
            let dataP = {
                pageSize: 1,
                pageIndex: 0,
                filterParameters: [
                    {
                        field: 'PrimaryCategoryName',
                        value: primary,
                        operator: 'contains',
                    },
                ],
            };
            let response = await firstValueFrom(
                this.service.getAllPrimaryCategories(dataP)
            );
            this.PensionForm.patchValue({
                PrimaryCategoryId: response.result?.data?.[0]?.id,
            });
            if (response.result && response.result.data) {
                let value = response.result.data;
                if (value.length != 0) {
                    let len_val = value.length;
                    this.primary_id_select = [];
                    for (let i = 0; i < len_val; i++) {
                        this.primary_id_select.push({
                            label: `${value[i].id}-${value[i].primaryCategoryName}`,
                            value: value[i].id,
                        });
                    }
                } else {
                    this.toastService.showError('Could Not Found');
                }
            }
            this.primary_id = this.primary_id_select.find(
                (val) =>
                    val.label ==
                    `${response.result?.data?.[0]?.id}-${response.result?.data?.[0]?.primaryCategoryName}`
            );
            this.displayInsertModal = true;
            let value_for_patch = {
                PrimaryCategoryId: this.primary_id.value,
            };
            this.PensionForm.patchValue(value_for_patch);
        } else if (sub) {
            this.sub_from_url = sub;
            let dataS = {
                pageSize: 1,
                pageIndex: 0,
                filterParameters: [
                    {
                        field: 'SubCategoryName',
                        value: sub,
                        operator: 'contains',
                    },
                ],
            };

            let responseS = await firstValueFrom(
                this.service.getAllSubCategories(dataS)
            );
            this.PensionForm.patchValue({
                PrimaryCategoryId: responseS.result?.data?.[0]?.id,
            });
            if (responseS.result && responseS.result.data) {
                let value = responseS.result.data;
                if (value.length != 0) {
                    let len_val = value.length;
                    this.sub_id_select = [];
                    for (let i = 0; i < len_val; i++) {
                        this.sub_id_select.push({
                            label: `${value[i].id}-${value[i].subCategoryName}`,
                            value: value[i].id,
                        });
                    }
                } else {
                    this.toastService.showError('Could Not Found');
                }
            }
            this.sub_id = this.sub_id_select.find(
                (val) =>
                    val.label ==
                    `${responseS.result?.data?.[0]?.id}-${responseS.result?.data?.[0]?.subCategoryName}`
            );

            this.displayInsertModal = true;
            let value_for_patch = {
                SubCategoryId: this.sub_id.value, // Fixed the error here
            };
            this.PensionForm.patchValue(value_for_patch);
        }
        //
    }
    // searching without get api
    handsearchKeyChange(event: string): void {
        if (event == '') {
            this.toastService.showError(`Search can not be empty`);
            return;
        }
        this.findById(event);
    }
    initializeForm(): void {
        this.PensionForm = new FormGroup({
            PrimaryCategoryId: new FormControl('', [Validators.required]),
            SubCategoryId: new FormControl('', [Validators.required]),
        });
    }
    clear(table: any) {
        table.clear();
    }
    onGlobalFilter(dt: any, event: any): void {
        if (event && event.target) {
            const input = event.target as HTMLInputElement;
            dt.filterGlobal(input.value, 'contains');
        }
    }
    // Add pension category
    async add_Pension_category() {
        if (this.PensionForm.valid) {
            const formData = this.PensionForm.value;
            let response = await firstValueFrom(
                this.service.createCategory(formData)
            );
            if (response.apiResponseStatus===APIResponseStatus.Success) {
                // Assuming 1 means success
                this.toastService.showSuccess(
                    'Pension Category Details added successfully'
                );
                this.displayInsertModal = false; // Close the dialog
                this.PensionForm.reset();
                this.primary_id = null;
                this.sub_id = null;
            } else {
                this.toastService.showError(
                    'Pension Category Details already exsists'
                );
                this.handleErrorResponse(response);
            }
        }
    }
    async find_extra_primary_id(filterValue: any) {
        console.log(filterValue);
        const id = filterValue.filter;
        if (id == null) {
            return;
        }
        console.log(id);
        let data = {
            pageSize: 10000,
            pageIndex: 0,
            filterParameters: [
                {
                    field: 'PrimaryCategoryName',
                    value: id,
                    operator: 'contains',
                },
            ],
        };

        let response = await firstValueFrom(
            this.service.getAllPrimaryCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            if (value.length != 0) {
                let len_val = value.length;
                this.primary_id_select = [];
                for (let i = 0; i < len_val; i++) {
                    this.primary_id_select.push({
                        label: `${value[i].id}-${value[i].primaryCategoryName}`,
                        value: value[i].id,
                    });
                }
            } else {
                this.toastService.showError('Could Not Found');
            }
        } else {
            console.error('Invalid response from API');
        }
    }
    async find_extra_sub_id(filterValue: any) {
        const id = filterValue.filter;
        if (id == null) {
            return;
        }
        console.log(id);
        let data = {
            pageSize: 10000,
            pageIndex: 0,
            filterParameters: [
                { field: 'SubCategoryName', value: id, operator: 'contains' },
            ],
        };
        let response = await firstValueFrom(
            this.service.getAllSubCategories(data)
        );
        this.isTableDataLoading = false;

        if (response.result && response.result.data) {
            let value = response.result.data;
            if (value.length != 0) {
                let len_val = value.length;
                this.sub_id_select = [];
                for (let i = 0; i < len_val; i++) {
                    this.sub_id_select.push({
                        label: `${value[i].id}-${value[i].subCategoryName}`,
                        value: value[i].id,
                    });
                }
            } else {
                this.toastService.showError('Could Not Found');
            }
        } else {
            console.error('Invalid response from API');
        }
    }
    clicked_Primary(name: any) {
        let value_for_patch = {
            PrimaryCategoryId: this.primary_id.value,
        };
        this.PensionForm.patchValue(value_for_patch);
    }
    clicked_Sub(name: any) {
        let value_for_patch = {
            SubCategoryId: this.sub_id.value, // Fixed the error here
        };
        this.PensionForm.patchValue(value_for_patch);
    }

    private handleErrorResponse(response: any) {
        if (
            response.message &&
            response.message.includes(
                'duplicate key value violates unique constraint'
            )
        ) {
            this.toastService.showError(
                'This Pension number already exists. Please use a different Pension number.'
            );
            this.PensionForm.get('PCID')?.setErrors({ duplicate: true });
        } else {
            this.toastService.showError(
                response.message ||
                    'An unexpected error occurred. Please try again.'
            );
        }
    }
    resetForm() {
        this.PensionForm.reset();
    }

    async getData() {
        const data = this.tableQueryParameters;
        this.isTableVisible = true;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllCategories(data)
        );
        if (response.apiResponseStatus === APIResponseStatus.Success) {
            this.tableData = response.result;
            this.isTableDataLoading = false;
        } else {
            this.toastService.showError("Can't get Data");
        }
    }

    // get id from  primary
    async get_id_from_primary_category() {
        const cacheKey = 'primaryCategoryData';
        const cacheExpiryKey = 'primaryCategoryExpiry';
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheExpiry = sessionStorage.getItem(cacheExpiryKey);
        const currentTime = new Date().getTime();
    
        // Check if cached data is still valid (within 10 minutes)
        if (cachedData && cacheExpiry && currentTime < Number(cacheExpiry)) {
            // Use the cached data
            const value = JSON.parse(cachedData);
            this.populatePrimaryIdSelect(value);
            this.primary_table = true;
            return;
        }
    
        // If no valid cache, make the API call
        let data = this.tableQueryParameters;
        data.pageSize = 10;
        let response = await firstValueFrom(this.service.getAllPrimaryCategories(data));
        this.isTableDataLoading = false;
    
        if (response.result && response.result.data) {
            let value = response.result.data;
            // Store the response in sessionStorage with a 10-minute expiry
            sessionStorage.setItem(cacheKey, JSON.stringify(value));
            sessionStorage.setItem(cacheExpiryKey, (currentTime + 10 * 60 * 1000).toString());
    
            this.populatePrimaryIdSelect(value);
            this.primary_table = true;
        } else {
            console.error('Invalid response from API');
        }
    }
    
    populatePrimaryIdSelect(value: any[]) {
        let len_val = value.length;
        this.primary_id_select = [];
        for (let i = 0; i < len_val; i++) {
            this.primary_id_select.push({
                label: `${value[i].id}-${value[i].primaryCategoryName}`,
                value: value[i].id,
            });
        }
    }
    
    // get id from  sub
    async get_id_from_sub_category() {
        const cacheKey = 'subCategoryData';
        const cacheExpiryKey = 'subCategoryExpiry';
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheExpiry = sessionStorage.getItem(cacheExpiryKey);
        const currentTime = new Date().getTime();
    
        // Check if cached data is still valid (within 10 minutes)
        if (cachedData && cacheExpiry && currentTime < Number(cacheExpiry)) {
            // Use the cached data
            const value = JSON.parse(cachedData);
            this.populateSubIdSelect(value);
            this.sub_table = true;
            return;
        }
    
        // If no valid cache, make the API call
        let data = this.tableQueryParameters;
        data.pageSize = 10;
        let response = await firstValueFrom(this.service.getAllSubCategories(data));
        this.isTableDataLoading = false;
    
        if (response.result && response.result.data) {
            let value = response.result.data;
            // Store the response in sessionStorage with a 10-minute expiry
            sessionStorage.setItem(cacheKey, JSON.stringify(value));
            sessionStorage.setItem(cacheExpiryKey, (currentTime + 10 * 60 * 1000).toString());
    
            this.populateSubIdSelect(value);
            this.sub_table = true;
        } else {
            console.error('Invalid response from API');
        }
    }
    
    populateSubIdSelect(value: any[]) {
        let len_val = value.length;
        this.sub_id_select = [];
        for (let i = 0; i < len_val; i++) {
            this.sub_id_select.push({
                label: `${value[i].id}-${value[i].subCategoryName}`,
                value: value[i].id,
            });
        }
    }
    

    async findById(id: any) {
        let payload = this.tableQueryParameters;
        payload.filterParameters = [
            { field: 'CategoryName', value: id, operator: 'contains' },
        ];
        payload.pageIndex = 0;
        this.isTableDataLoading = true;
        let response = await firstValueFrom(
            this.service.getAllCategories(payload)
        );
        if (response.result?.data?.length != 0) {
            this.tableData = response.result;
            this.refresh_b = true;
            this.searching.val = true;
            this.searching.data = id;
        } else {
            this.toastService.showError('No Pension Category ID found');
        }
        this.isTableDataLoading = false;
    }
    fun_refresh() {
        this.refresh_b = false;
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.searching.val = false;
        this.searching.data = null;
        this.getData();
    }
    // date 30-aug
    show_new_primary() {
        this.router.navigate(['master/app-pension/app-primary'], {
            queryParams: {
                todo: 'create',
                primary: this.primary_from_url,
                sub: this.sub_from_url,
            },
        });
    }
    show_new_sub() {
        this.router.navigate(['master/app-pension/app-sub-category'], {
            queryParams: {
                todo: 'create',
                primary: this.primary_from_url,
                sub: this.sub_from_url,
            },
        });
    }

    onClearPrimary(name: any) {
        if (name === null) {
            this.PensionForm.patchValue({
                PrimaryCategoryId: null,
            });
        }
    }
    onClearSub(name: any) {
        if (name === null) {
            this.PensionForm.patchValue({
                SubCategoryId: null,
            });
        }
    }

    emitPensionCategorySelected(): void {
        this.PensionCategorySelected.emit(this.PensionForm.value);
    }

    cancelPensionCategory() {
        this.PensionForm.reset();
        this.displayInsertModal = false;
    }

    getDialogHeight(): string {
        const width = window.innerWidth;
    
        if (width >= 1200) {
            return '400px';  // Set height for larger screens
        } else {
            return '400px';  // Set height for extra-small screens
        }
    }

    createpensioncategory(){
        //   this.navc.navigateTo('/pension/modules/pension-process/ppo/receipt/new','/pension/modules/pension-process/ppo/manualPpoReceipt')
        this.router.navigate(['/master/app-pension/app-pension-category/new']); 
  
    }
    onDialogClose(){
        this.location.back();
    }
}
