import { Result } from './../../../../core/models/pension-bill';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    PensionFirstBillService,
    PensionBankBranchService,
    ListAllPpoReceiptsResponseDTOIEnumerableDynamicListResultJsonAPIResponse,
    APIResponseStatus,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { PdfGenerationService } from 'src/app/core/services/first-pension/pdf-generation.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-first-pension-bill-print',
    templateUrl: './first-pension-bill-print.component.html',
    styleUrls: ['./first-pension-bill-print.component.scss'],
})
export class FirstPensionBillPrintComponent implements OnInit {
    FirstPensionForm!: FormGroup;
    selectedPension: any;
    pdfData: any;
    pensionComponent$?: Observable<any>;
    @Input() ppoId?: string;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private pensionFirstBillService: PensionFirstBillService,
        private pensionBankBranchService: PensionBankBranchService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.FirstPensionForm = this.fb.group({
            generation: [''],
            ppoId: ['', Validators.required],
            pensionerName: ['', Validators.required],
        });
        let payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            },
        };
        this.pensionComponent$ =
            this.pensionFirstBillService.getPposForFirstBillPrint();
        // Check if ppoId is provided via route parameters
        this.route.paramMap.subscribe((params) => {
            const routePpoId = params.get('ppoId');
            if (routePpoId) {
                this.ppoId = routePpoId;
                this.fetchUserInfo();
            }
        });
    }

    handleSearchEvent(event: any) {
        console.log('', event);
        this.FirstPensionForm.controls['ppoId'].setValue(event.ppoId);
        this.FirstPensionForm.controls['pensionerName'].setValue(
            event.pensionerName
        );
    }

    async fetchUserInfo(): Promise<void> {
        if (this.ppoId) {
            try {
                if (this.pensionComponent$) {
                    const response = await firstValueFrom(
                        this.pensionComponent$
                    );

                    if (response && response.result && response.result.data) {
                        if (Array.isArray(response.result.data)) {
                            const matchingPensioner = response.result.data.find(
                                (p: any) => p.ppoId.toString() === this.ppoId
                            );

                            if (matchingPensioner) {
                                this.handleSearchEvent(matchingPensioner);
                            } else {
                                console.warn(
                                    'No matching pensioner found for ppoId:',
                                    this.ppoId
                                );
                            }
                        } else {
                            console.warn(
                                'Response result data is not an array:',
                                typeof response.result.data
                            );
                        }
                    } else {
                        console.warn(
                            'Response, result, or data is missing:',
                            response
                        );
                    }
                } else {
                    console.warn('pensionComponent$ is undefined');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                if (error instanceof Error) {
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                }
            }
        } else {
            console.warn('No ppoId provided');
        }
        console.warn('fetchUserInfo completed');
    }

    onRefresh(): void {
        this.FirstPensionForm.reset();
    }

    onGenerate(generationType: string) {
        if (!this.isFormValid()) {
            this.toastService.showError(
                'Please complete all required fields and select a report type.'
            );
            return;
        }
        if (generationType === 'generalBill') {
            this.generatePDFdata();
        } else if (generationType === 'classificationBill') {
            console.log('Generating classification bill...');
        }
    }

    isFormValid(): boolean {
        return (
            this.FirstPensionForm.valid &&
            this.FirstPensionForm.get('generation')?.value
        );
    }

    generatePDFdata() {
        const ppoId = this.FirstPensionForm.get('ppoId')?.value;
        if (!ppoId) {
            this.toastService.showError('Please select a PPO ID first');
            return;
        }

        firstValueFrom(
            this.pensionFirstBillService.getFirstPensionBillByPpoId(ppoId)
        )
            .then((response) => {
                if (response.apiResponseStatus !== APIResponseStatus.Success) {
                    this.toastService.showError(
                        response.message ?? 'An unknown error occurred'
                    );
                    return;
                }
                console.log(response);
                if (response.message)
                    this.toastService.showSuccess(response.message);
                //   switch (true) {
                //   case !response?.result?.id:
                //       this.toastService.showError('Id is missing');
                //       break;
                //   case !response?.result?.treasuryVoucherNo:
                //       this.toastService.showError('TreasuryVoucherNo is missing');
                //       break;
                //   case !response?.result?.billDate:
                //       this.toastService.showError('BillDate is missing');
                //       break;
                //   case !response?.result?.treasuryVoucherDate:
                //       this.toastService.showError('TreasuryVoucherDate is missing');
                //       break;
                //   case !response?.result?.pensioner?.ppoId:
                //       this.toastService.showError('Ppo id is missing');
                //       break;
                //   case !response?.result?.pensioner?.ppoNo:
                //       this.toastService.showError('Ppo No is missing');
                //       break;
                //   case !response?.result?.pensioner?.receipt:
                //       this.toastService.showError('Receipt information is missing');
                //       break;
                //   case !response?.result?.pensioner?.dateOfCommencement:
                //       this.toastService.showError('Date of commencement is missing');
                //       break;
                //   case !response?.result?.pensioner?.pensionerName:
                //       this.toastService.showError('Pensioner name is missing');
                //       break;
                //   case !response?.result?.pensioner?.category:
                //       this.toastService.showError('Category information is missing');
                //       break;
                //   case !response?.result?.pensioner?.category?.primaryCategory:
                //       this.toastService.showError('PrimaryCategory information is missing');
                //       break;
                //   case !response?.result?.pensioner?.category?.primaryCategory?.hoaId:
                //       this.toastService.showError('Hoa id is missing');
                //       break;
                //   case !response?.result?.pensioner?.category?.categoryName:
                //       this.toastService.showError('Category name is missing');
                //       break;
                //   case !response?.result?.ppoBillBreakups:
                //       this.toastService.showError('PPO bill breakup information is missing');
                //       break;
                //   case response?.result?.ppoBillBreakups && !response?.result?.ppoBillBreakups.some(breakup => breakup.revision):
                //       this.toastService.showError('Revision information is missing in some or all PPO bill breakups');
                //       break;
                //   case !response?.result?.preparedBy:
                //       this.toastService.showError('Prepared by information is missing');
                //       break;
                //   case !response?.result?.preparedOn:
                //       this.toastService.showError('Prepared on information is missing');
                //       break;
                //   }

                // this.pdfData = {
                //     response: response,
                //     bankName: '',
                //     branchName: '',
                //     branchAddress: '',
                // };
                // if(response.result?.pensioner === null || response.result?.pensioner?.receipt === null || response.result?.pensioner?.bankAccounts === null || response.result?.pensioner?.category === null || response.result?.ppoBillBreakups === null) {
                //   this.toastService.showError('Data is missing, cannot generate PDF. Please check if all required fields are available.');
                //   return;

                // }
                if (response.result) {
                    this.generatePDF(response.result);
                }
            })
            .catch((error: { message: any }) => {
                console.error('Error generating PDF:', error);
                this.toastService.showError(
                    'Error generating PDF: ' +
                        (error.message || 'Unknown error')
                );
            });
    }

    generatePDF(result: any): void {
        const doc = new jsPDF();

        // Helper to replace null values
        const handleNull = (value: any) =>
            value === null || value === undefined ? 'N/A' : value;

        // Title
        doc.setFontSize(16);
        doc.text('Pension Bill Details', 10, 10);

        // General Details
        doc.setFontSize(12);
        doc.text('General Details', 10, 20);
        autoTable(doc, {
            body: Object.entries(result)
                .filter(
                    ([key, value]) =>
                        !Array.isArray(value) && typeof value !== 'object'
                )
                .map(([key, value]) => [key, handleNull(value)]),
            startY: 25,
            theme: 'grid',
        });

        // Track vertical position
        let finalY = (doc as any).lastAutoTable.finalY || 25;

        // Pensioner Details
        doc.text('Pensioner Details', 10, finalY + 10);
        autoTable(doc, {
            body: Object.entries(result.pensioner || {})
                .filter(
                    ([key, value]) =>
                        !Array.isArray(value) && typeof value !== 'object'
                )
                .map(([key, value]) => [key, handleNull(value)]),
            startY: finalY + 15,
            theme: 'grid',
        });

        // Update vertical position
        finalY = (doc as any).lastAutoTable.finalY || 25;

        // PPO Bill Breakups
        doc.text('PPO Bill Breakups', 10, finalY + 10);
        if (result.ppoBillBreakups && Array.isArray(result.ppoBillBreakups)) {
            autoTable(doc, {
                head: [
                    [
                        'Component Name',
                        'Amount Per Month',
                        'Breakup Amount',
                        'Net Amount',
                    ],
                ],
                body: result.ppoBillBreakups.map(
                    (breakup: {
                        componentName: any;
                        amountPerMonth: any;
                        breakupAmount: any;
                        netAmount: any;
                    }) => [
                        handleNull(breakup.componentName),
                        handleNull(breakup.amountPerMonth),
                        handleNull(breakup.breakupAmount),
                        handleNull(breakup.netAmount),
                    ]
                ),
                startY: finalY + 15,
                theme: 'striped',
            });
        }

        // Update vertical position
        finalY = (doc as any).lastAutoTable.finalY || 25;

        // Component Rates
        doc.text('Component Rates', 10, finalY + 10);
        if (
            result.pensioner &&
            Array.isArray(result.pensioner.componentRates)
        ) {
            autoTable(doc, {
                head: [['Component Name', 'Component Rate', 'Rate Amount']],
                body: result.pensioner.componentRates.map(
                    (rate: {
                        breakup: { componentName: any };
                        componentRate: any;
                        rateAmount: any;
                    }) => [
                        handleNull(rate.breakup?.componentName),
                        handleNull(rate.componentRate),
                        handleNull(rate.rateAmount),
                    ]
                ),
                startY: finalY + 15,
                theme: 'striped',
            });
        }

        // Save the PDF
        doc.save('PensionBill.pdf');
    }
}
