import { Result } from './../../../../core/models/pension-bill';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { Validators } from '@angular/forms';
import { Payload } from 'src/app/core/models/search-query';
import { CommonModule, formatDate } from '@angular/common';
import {
    PensionManualPPOReceiptService,
    PensionPPODetailsService,
    PensionCategoryMasterService,
    ListAllPpoReceiptsResponseDTO,
    APIResponseStatus,
    PensionBankBranchService,
    PensionPPOStatusService,
    PensionStatusFlag,
    PensionStatusEntryDTO,
} from 'src/app/api';
import { firstValueFrom, Observable, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PensionFactoryService } from 'src/app/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ppid } from 'process';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DynamicTableModule } from 'src/app/core/dynamic-table/dynamic-table.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { StepsModule } from 'primeng/steps';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
@Component({
    selector: 'app-pensioner-status',
    templateUrl: './pensioner-status.component.html',
    styleUrls: ['./pensioner-status.component.scss'],
    providers: [PensionFactoryService],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        DynamicTableModule,
        OptionCardModule,
        CommonHeaderModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule,
        StepsModule,
        InputTextareaModule,
        CardModule,
        SelectButtonModule,
        CheckboxModule,
        PanelModule,
        FieldsetModule,
        RadioButtonModule,
        DividerModule,
        PopupTableModule,
    ],
})
export class PensionerStatusComponent implements OnInit {
    Ppoid?: any;
    PensionerName?: any;
    PensionerType?: any;
    allManualPPOReceipt$?: Observable<any>;
    text?: any;
    checked: boolean = false;
    reasondiv: boolean = false;
    startdate?: any;
    AccountHolder?: any;
    statusOption?: any;
    reasons?: any;
    StatusDetailsDiv: boolean = false;
    pastStatusWef?: any;
    pastReason?: any;
    pastRemark?: any;
    SlNo?: any = 0;
    statusFormDetails: FormGroup = new FormGroup({});

    constructor(
        private ServiceForId: PensionPPODetailsService,
        private status: PensionPPOStatusService,
        private fb: FormBuilder,
        private ppoListService: PensionPPODetailsService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.allManualPPOReceipt$ = this.ServiceForId.getPensioners();
        this.ininalizer();
    }
    ininalizer() {
        this.statusFormDetails = this.fb.group({
            statusFlag: [null, Validators.required],
            reasonFlag: [null],
            statusWef: [null, Validators.required],
            reasonRemark: [null],
            ppoId: [null, Validators.required],
            dataSource: null,
            statusUpto: null,
        });
    }

    async handelManualEntrySelect(event: any) {
        this.StatusDetailsDiv = true;
        this.Ppoid = event.ppoId;

        this.PensionerName = '';
        this.PensionerType = '';
        this.text = '';
        this.startdate = '';
        this.AccountHolder = '';
        this.statusOption = '';
        this.reasons = '';
        this.pastStatusWef = '';
        this.pastReason = '';
        this.pastRemark = '';
        this.statusFormDetails.patchValue({
            ppoId: this.Ppoid,
        });

        this.PensionerName = event.pensionerName;
        const response = await firstValueFrom(
            this.ppoListService.getPensionerByPpoId(this.Ppoid)
        );
        this.fill(response);

        this.callStatus(this.Ppoid);
    }
    changeReasonlist(reason: any) {
        if (reason == 'PpoSuspended') {
            this.reasondiv = true;
            this.reasons = [
                { label: 'select', value: null },
                {
                    label: 'Life Certificate Not Submitted',
                    value: 'LifeCertificateNotSubmitted',
                },
                { label: 'Death', value: 'Death' },
                { label: 'others', value: 'Others' },
            ];
        } else if (reason == 'PpoRunning') {
            this.reasondiv = true;
            this.reasons = [
                { label: 'select', value: null },
                {
                    label: 'Life Certificate Submitted',
                    value: 'LifeCertificateSubmitted',
                },
                { label: 'others', value: 'Others' },
            ];
        } else if (reason == 'PpoClosed') {
            this.reasondiv = true;
            this.reasons = [
                { label: 'select', value: null },
                {
                    label: 'Life Certificate Not Submitted',
                    value: 'LifeCertificateNotSubmitted',
                },
                { label: 'Death', value: 'Death' },
                { label: 'others', value: 'Others' },
            ];
        } else {
            this.reasondiv = false;
        }

    }
    async callStatus(id: any): Promise<void> {
        const list: PensionStatusFlag[] = [
            'PpoSuspended',
            'PpoRunning',
            'PpoClosed',
        ];
        let a;
        for (const li of list) {
            a = await firstValueFrom(
                this.status.getPpoStatusFlagByPpoId(id, li)
            );
            if (a.apiResponseStatus == 'Success') {
                this.statusOption = li;
                this.statusFormDetails.patchValue({
                    statusFlag: this.statusOption,
                });
                break;
            }
            this.statusOption = null;
        }
        this.changeReasonlist(this.statusOption);

        this.pastStatusWef = a?.result?.statusWef;
        this.pastReason = a?.result?.reasonFlag;
        if (a?.result?.reasonRemark) {
            this.pastRemark = a?.result?.reasonRemark;
        } else {
            this.pastRemark = 'NONE';
        }
    }
    fill(response: any): void {
        if (response.result?.ppoType === 'P') {
            this.PensionerType = 'Pension';
        } else if (response.result?.ppoType === 'F') {
            this.PensionerType = 'Bank';
        } else {
            this.PensionerType = 'CPF';
        }
        this.AccountHolder = response.result.accountHolderName;

        this.startdate = response.result?.dateOfCommencement;
    }
    changeStatus(event: any) {
        this.statusOption = event.value;
        this.statusFormDetails.patchValue({
            statusFlag: this.statusOption,
        });
        this.changeReasonlist(this.statusOption);
    }
    changeReason(event: any) {
        this.statusFormDetails.patchValue({
            reasonFlag: event.value,
        });
    }
    getDate(event: any) {
        const year = event.getFullYear();
        const month = String(event.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(event.getDate()).padStart(2, '0');

        this.statusFormDetails.patchValue({
            statusWef: `${year}-${month}-${day}`,
        });
    }
    async saveData() {
        if (this.checked) {
            const payload: PensionStatusEntryDTO = {
                statusFlag: this.statusFormDetails.value.statusFlag,
                statusWef: this.statusFormDetails.value.statusWef,
                ppoId: this.statusFormDetails.value.ppoId,
                reasonFlag: this.statusFormDetails.value.reasonFlag,
                reasonRemark: this.statusFormDetails.value.reasonRemark,
            };

            const val = await firstValueFrom(this.status.setPpoStatusFlag(payload));
            console.log(val);
            if (val.apiResponseStatus === 'Success') {
                this.toastService.showSuccess('' + val.message);
            }
        } else {
            this.toastService.showWarning('Please check the Changed Option');
        }
    }
}
