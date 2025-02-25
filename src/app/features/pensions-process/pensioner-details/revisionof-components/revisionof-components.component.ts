import { TableHeader } from './../../../../api/model/table-header';
import { FormData } from './../../../../core/models/indentFormData';
import {
    Component,
    HostListener,
    importProvidersFrom,
    Input,
    OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ppid } from 'process';
import { firstValueFrom, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Import debounceTime and distinctUntilChanged
import {
    APIResponseStatus,
    PensionComponentRevisionService,
    PensionComponentService,
    PensionFirstBillService,
    PensionPPODetailsService,
    PpoBillResponseDTOJsonAPIResponse,
    PpoComponentRevisionEntryDTO,
    PensionBankBranchService,
    PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse,
    ComponentRateResponseDTOTableResponseDTOJsonAPIResponse,
    PpoComponentRevisionResponseDTO,
} from 'src/app/api';
import { PensionComponentRateService } from 'src/app/api/api/pension-component-rate.service';
import { DatePipe } from '@angular/common';
import { flush } from '@angular/core/testing';
import { ToastService } from 'src/app/core/services/toast.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-revisionof-components',
    templateUrl: './revisionof-components.component.html',
    styleUrls: ['./revisionof-components.component.scss'],
})
export class RevisionofComponentsComponent implements OnInit {
    revisionOfComponentsForm: FormGroup = new FormGroup({});
    pensionForm: FormGroup = new FormGroup({}); // Declare pensionForm
    tableForm: FormGroup = new FormGroup({}); // Declare pensionForm
    componentForm: FormGroup = new FormGroup({}); // Declare pensionForm
    ppoList$: Observable<PpoComponentRevisionPpoListItemDTOTableResponseDTOJsonAPIResponse>;
    pensionComponent$!: Observable<ComponentRateResponseDTOTableResponseDTOJsonAPIResponse>;
    showTable: boolean = false;
    getpensionbill!: PpoBillResponseDTOJsonAPIResponse;
    ppoId?: number;
    response: any;
    isSearch: boolean = false;
    editRowId: number | null = null;
    isInsertModalVisible: boolean = false;
    hasPpoDetailsFetched = false;
    rateid: any;
    isEditMode: boolean = false;

    hidePpoId: boolean = false;

    isMobileView: boolean = false;
    isPopupTableDisabled = true;
    pensionData: any[] = [];
    dialogHeader = 'Component Rate';
    disableAmount = false;
    componentName!: string;
    TableHeaders!: any;
    TableData!: [] | any;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.isMobileView = window.innerWidth <= 900;
    }

    constructor(
        private fb: FormBuilder,
        private revisionOfComponentsService: PensionComponentRevisionService,
        private ppoListService: PensionPPODetailsService,
        private firstbill: PensionFirstBillService,
        private pensionComponentService: PensionComponentService,
        private datePipe: DatePipe,
        private toastService: ToastService,
        private bank: PensionBankBranchService,
        private pensionComponentRateService: PensionComponentRateService
    ) {
        this.ppoList$ =
            this.revisionOfComponentsService.getAllPposForComponentRevisions();
    }

    ngOnInit(): void {
        this.pensionForm = this.fb.group({
            ppoId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // PPO ID must be a number
        });
        this.componentForm = this.fb.group({
            componentname: [
                { value: '', disabled: false },
                Validators.required,
            ],
            fromDate: ['', Validators.required],
            amount: [{ value: '', disabled: false }, Validators.required],
        });
        // this.tableForm = this.fb.group({
        //     revisions: this.fb.array([]), // Create an empty FormArray for table rows
        // });
        this.pensionForm.get('ppoId')?.valueChanges.subscribe((value) => {
            this.ppoId = value;
        });
        this.isMobileView = window.innerWidth <= 900; // Set on init
    }

    handleSelectedRow(event: any) {
        this.pensionForm.patchValue({
            ppoId: event.ppoId,
        });
        const selectedData = {
            ppoId: event.ppoId,
            bankcode: event.bankBranchName,
            ppono: event.ppoNo,
            pensionerName: event.pensionerName,
            category: event.categoryDescription,
        };
        // Push selected data to pensionData array
        this.pensionData.push(selectedData);

        if (this.pensionForm.valid) {
            this.hasPpoDetailsFetched = true;
            this.isSearch = true;
        }
    }
    // get revisions() {
    //     return this.tableForm.get('revisions') as FormArray;
    // }

    async SearchComponent() {
        if (this.ppoId) {
            const response = await firstValueFrom(
                this.revisionOfComponentsService.getPpoComponentRevisionsByPpoId(
                    this.ppoId
                )
            );
            if (response.apiResponseStatus === APIResponseStatus.Success) {
                this.toastService.showSuccess('' + response.message);
                this.response = response.result?.data;
                this.TableHeaders = response.result?.headers ?? [];

                await this.newresponse(response.result);
                this.isPopupTableDisabled = !this.pensionForm.valid;

                await this.settingToDate();
                this.hidePpoId = true;
                this.showTable = true;

                if (
                    response?.result &&
                    Array.isArray(response.result.data) &&
                    response.result.data.length > 0 &&
                    response.result.data[0].rate?.categoryId
                ) {
                    this.pensionComponent$ =
                        this.pensionComponentRateService.getComponentRatesByCategoryId(
                            response.result.data[0].rate.categoryId
                        );
                }
            }
        }
    }
    async newresponse(response: any) {
        this.TableData = [];

        const dataCount = response.dataCount;
        for (let i = 0; i < dataCount; i++) {
            const data = response.data[i];
            let a: { [key: string]: any } = {};
            for (let j = 0; j < this.TableHeaders.length; j++) {
                a[this.TableHeaders[j].fieldName] = this.getValueByKey(
                    data,
                    this.TableHeaders[j].fieldName
                );
            }
            this.TableData.push(a);
        }
        console.log(this.TableData);
    }
    getValueByKey(obj: any, key: string): any {
        if (!obj || typeof obj !== 'object') return 'Key Not Found';

        // If key exists at the current level, return its value
        if (key in obj) return obj[key];

        // Recursively search in nested objects
        for (const k in obj) {
            if (typeof obj[k] === 'object') {
                const result = this.getValueByKey(obj[k], key);
                if (result !== 'Key Not Found') return result;
            }
        }

        return 'Key Not Found';
    }

    parseDate(dateStr: string): Date {
        if (!dateStr) {
            throw new Error('Invalid date input');
        }

        // Check if it's already a valid Date object in string format
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
        }

        // Convert "dd-mm-yyyy" to "yyyy-mm-dd" before parsing
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('-');
            const formattedDate = new Date(`${year}-${month}-${day}`);
            if (!isNaN(formattedDate.getTime())) {
                return formattedDate;
            }
        }

        throw new Error(`Invalid date format: ${dateStr}`);
    }

    // Enable edit for specific row by id
    enableEdit(rowId: any) {
        this.editRowId = rowId.id;
        this.isEditMode = true;
        this.dialogHeader = 'Update Component';
        this.isInsertModalVisible = true;

        console.log(rowId);

        this.componentForm.patchValue({
            fromDate: rowId?.fromDate,
            amount: rowId?.amountPerMonth,
        });
    }

    // Save changes and disable edit mode
    async saveRow() {
        if (this.editRowId) {
            const value = this.convertToDateFormat(
                this.componentForm.get('fromDate')?.value
            );
            const payload = {
                fromDate: value,
                amountPerMonth: this.componentForm.get('amount')?.value,
            };
            try {
                const response = await firstValueFrom(
                    this.revisionOfComponentsService.updatePpoComponentRevisionById(
                        this.editRowId,
                        payload
                    )
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastService.showSuccess('' + response.message);

                    // Update the specific item in this.response
                    const index = this.TableData.findIndex(
                        (item: any) => item.id === this.editRowId
                    );
                    if (index !== -1) {
                        this.TableData[index].fromDate = payload.fromDate;
                        this.TableData[index].amountPerMonth =
                            payload.amountPerMonth;
                    }

                    await this.settingToDate();
                }
            } catch (error) {
                this.toastService.showError('' + APIResponseStatus.Error);
            } finally {
                this.isInsertModalVisible = false;
            }
        }
    }
    // Delete Component
    async delete(rowId: any) {
        await Swal.fire({
            title: 'Are you sure?',
            text: 'Delete this component!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await firstValueFrom(
                    this.revisionOfComponentsService.deletePpoComponentRevisionById(
                        rowId.id
                    )
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastService.showSuccess('' + response.message);
                    this.TableData = this.TableData.filter(
                        (data: any) => data.id !== rowId.id
                    );
                    await this.settingToDate();
                } else if (
                    response.apiResponseStatus === APIResponseStatus.Error
                ) {
                    this.toastService.showSuccess('' + response.message);
                }
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success',
                });
            }
        });
    }
    yyyymmddToddmmyyyy(dateStr: string): string {
        if (!dateStr) {
            console.error('Invalid date input');
            return '';
        }

        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            return dateStr;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-');
            return `${day}-${month}-${year}`;
        }

        console.error('Invalid date format:', dateStr);
        return '';
    }
    // save Component
    async saveComponent() {
        if (this.componentForm.invalid) {
            this.componentForm.markAllAsTouched();
            return;
        }
        const data = this.componentForm.value;
        const fromDateValue = this.convertToDateFormat(
            this.componentForm.get('fromDate')?.value
        );

        const payload: PpoComponentRevisionEntryDTO = {
            rateId: this.rateid,
            fromDate: fromDateValue,
            amountPerMonth: this.componentForm.get('amount')?.value,
        };

        if (this.ppoId && this.componentForm.valid) {
            const response = await firstValueFrom(
                this.revisionOfComponentsService.createSinglePpoComponentRevision(
                    this.ppoId,
                    payload
                )
            );

            if (response.apiResponseStatus === APIResponseStatus.Success) {
                this.toastService.showSuccess('' + response.message);
                this.resetAndCloseDialog();
                await this.addToCurrentData(response.result);
                this.isInsertModalVisible = false;
                this.componentForm.reset();
                this.rateid = null;
            } else if (response.apiResponseStatus === APIResponseStatus.Error) {
                this.toastService.showWarning('' + response.message);
                return;
            }
        }
    }

    async addToCurrentData(data: any) {
        if (data) {
            // console.log(data);
            const a: { [key: string]: any } = {};
            for (let j = 0; j < this.TableHeaders.length; j++) {
                a[this.TableHeaders[j].fieldName] = this.getValueByKey(
                    data,
                    this.TableHeaders[j].fieldName
                );
            }
            this.TableData.push(a);
            await this.settingToDate();
        }
    }
    async settingToDate(): Promise<void> {
        const newData = this.TableData;
        this.TableData = [];
        if (newData) {
            this.TableData = newData.sort((a: any, b: any) => {
                const dateA = this.parseDate(a.fromDate);
                const dateB = this.parseDate(b.fromDate);
                return dateA.getTime() - dateB.getTime();
            });
        }

        let component;
        if (this.TableData != null) {
            for (let i = 0; i < this.TableData.length; i++) {
                this.TableData[i].toDate = 'Till Date';
                this.TableData[i].fromDate = this.yyyymmddToddmmyyyy(
                    this.TableData[i].fromDate
                );
            }
            for (let i = 1; i < this.TableData.length; i++) {
                component = this.TableData[i].componentDescription;
                for (let j = i - 1; j >= 0; j--) {
                    if (this.TableData[j].componentDescription == component) {
                        this.TableData[j].toDate = this.getPreviousDate(
                            this.TableData[i].fromDate
                        );
                        break;
                    }
                }
            }
        }
    }
    getPreviousDate(dateStr: string): string {
        if (!dateStr) {
            console.error('Invalid date input');
            return '';
        }

        let day: number, month: number, year: number;

        // Check if the format is YYYY-MM-DD or DD-MM-YYYY
        const parts = dateStr.split('-').map(Number);

        if (parts.length !== 3 || parts.some(isNaN)) {
            console.error('Invalid date format:', dateStr);
            return '';
        }

        if (parts[0] > 31) {
            // Format: YYYY-MM-DD (first part is year)
            [year, month, day] = parts;
        } else {
            // Format: DD-MM-YYYY (first part is day)
            [day, month, year] = parts;
        }

        const date = new Date(year, month - 1, day); // Months are 0-based

        if (isNaN(date.getTime())) {
            console.error('Invalid date after parsing:', dateStr);
            return '';
        }
        date.setDate(date.getDate() - 1);
        const prevDay = String(date.getDate()).padStart(2, '0');
        const prevMonth = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const prevYear = date.getFullYear();

        return `${prevDay}-${prevMonth}-${prevYear}`;
    }

    refresh() {
        this.pensionForm.reset();
        this.showTable = false;
        this.isSearch = false;
        this.hasPpoDetailsFetched = false;
        this.isPopupTableDisabled = true;
        this.hidePpoId = false;
        this.pensionData = [];
    }
    handleSelectedRowByPensionComponent(event: any) {
        this.rateid = event.id;
        this.componentName = event.componentName;
        const type = event.rateType;
        const rateAmount = event.rateAmount;
        this.componentForm.controls['componentname'].disable();

        if (type == 'A') {
            if (rateAmount == 0) {
                this.componentForm.patchValue({
                    componentname: event.componentName,
                    amount: '',
                });
                this.componentForm.controls['amount'].enable();
            } else {
                this.componentForm.patchValue({
                    componentname: event.componentName,
                    amount: rateAmount,
                });
                this.componentForm.controls['amount'].disable();
            }
        } else {
            let flag = true;
            for (let i = 0; i < this.TableData.length; i++) {
                if (
                    this.TableData[i].componentDescription.split('-')[1] ==
                    'BASIC PENSION'
                ) {
                    this.componentForm.patchValue({
                        componentname: event.componentName,
                        amount:
                            (this.TableData[i].amountPerMonth * rateAmount) /
                            100,
                    });
                    this.componentForm.controls['amount'].disable();
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.toastService.showError('Basic Pension Not Found');
            }
        }
    }

    addcomponent() {
        this.isInsertModalVisible = true;
        this.isEditMode = false;
        this.dialogHeader = 'Component Rate';
    }

    cancelEdit(rowId: number) {
        if (this.editRowId === rowId) {
            this.editRowId = null;
        }
    }
    // Custom method to subtract one day from the next row's fromDate

    resetAndCloseDialog(): void {
        this.componentForm.reset();
        this.isInsertModalVisible = false;
        this.editRowId = null;
    }
    convertToDateFormat(inputDate: string): string {
        // First, check if the input matches 'dd-MM-yyyy' format using regex
        const regex = /^\d{2}-\d{2}-\d{4}$/;

        if (regex.test(inputDate)) {
            const [day, month, year] = inputDate.split('-');
            return `${year}-${month}-${day}`;
        } else {
            // For any other input (such as full date strings), parse using the Date constructor
            const parsedDate = new Date(inputDate);
            if (isNaN(parsedDate.getTime())) {
                return '';
            } else {
                // Return the date in 'yyyy-MM-dd' format
                const year = parsedDate.getFullYear();
                const month = (parsedDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0');
                const day = parsedDate.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`; // Return the formatted date string
            }
        }
    }
}
