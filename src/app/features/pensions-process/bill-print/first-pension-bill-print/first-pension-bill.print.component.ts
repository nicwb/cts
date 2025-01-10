import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    PensionFirstBillService,
    PensionBankBranchService,
    APIResponseStatus,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { DialogService } from 'primeng/dynamicdialog';
import { FirstPensionPdfViewerComponent } from 'src/app/core/services/pdf-viewer/first-pension-pdf-viwer.component';

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
        private route: ActivatedRoute,
        private router: Router,
        private dialog: DialogService
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
    }

    onRefresh(): void {
        this.FirstPensionForm.reset();
        this.router.navigate([
            'pension-process/bill-print/first-pension-bill-print',
        ]);
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
                //   case !response?.result?.pensioner?.category?.primaryCategory?.hoaID:
                //       this.toastService.showError('hoaID is missing');
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
        doc.setProperties({
            title: 'Pension Bill Report',
            subject: 'Generated Report',
            author: `${result?.preparedBy}`,
            keywords: 'Pension, Bill, PDF',
            creator: 'IFMS PENSION Report',
        });
        doc.setFontSize(14);
        doc.text('Government Of West Bengal - Treasury ', 60, 10);
        doc.text(result?.treasuryName, 90, 15);
        doc.setFontSize(12);
        doc.text('First Pension Bill', 90, 20);
        doc.setFontSize(13);
        doc.text(
            `For the Period of ${result.fromDate} To ${result.billDate}`,
            60,
            25
        );
        doc.line(10, 27, 200, 27);
        doc.setFontSize(8);
        doc.text(`BILL ID: ${result?.billNo}`, 20, 30);
        doc.text(`BILL DATE: ${result?.billDate}`, 20, 35);
        doc.text(`PPO ID: ${result?.pensioner?.ppoId}`, 20, 40);
        doc.text(
            `BANK NAME: ${result?.bankBranchName.split(' - ')[0]}`,
            20,
            45
        );
        doc.text(
            `BANK ADDRESS: ${result?.bankBranchName.split(' - ')[1]}`,
            20,
            50
        );
        doc.text(
            `COMMENCEMENT DATE: ${result?.pensioner?.dateOfCommencement}`,
            20,
            55
        );
        doc.text(`SANCTION ORDER NUMBER: `, 20, 60);
        doc.text(
            `CATEGORY: ${result?.pensioner?.category?.categoryName}`,
            20,
            65
        );
        doc.text(`VOUCHER NUMBER: ${result?.treasuryVoucherNo}`, 120, 30);
        doc.text(`VOUCHER DATE: ${result?.treasuryVoucherDate}`, 120, 35);
        doc.text(`PPO NUMBER: ${result?.pensioner?.ppoNo}`, 120, 40);
        doc.text(`BANK ACCOUNT: ${result?.pensioner?.bankAcNo}`, 120, 45);
        const hoaID =
            `${result.pensioner.category.primaryCategory.accountHead.majorHead}-${result.pensioner.category.primaryCategory.accountHead.submajorHead}-${result.pensioner.category.primaryCategory.accountHead.minorHead}-` +
            `${result.pensioner.category.primaryCategory.accountHead.planStatus}-${result.pensioner.category.primaryCategory.accountHead.schemeHead}-${result.pensioner.category.primaryCategory.accountHead.votedCharged}-` +
            `${result.pensioner.category.primaryCategory.accountHead.detailHead}-${result.pensioner.category.primaryCategory.accountHead.subdetailHead}`;
        doc.text(`ACCOUNT HEAD: ${hoaID}`, 120, 50);
        doc.text(
            `PENSIONER NAME: ${result?.pensioner?.pensionerName}`,
            120,
            55
        );

        (doc as any).autoTable({
            startY: 75,
            margin: { top: 20, left: 15, right: 15 },
            headStyles: { fillColor: [100, 100, 100] },
            bodyStyles: { fillColor: [255, 255, 255] },

            head: [
                [
                    'Period',
                    'Component Description',
                    'Due Amount',
                    'Drawn Amount',
                    'Paid/Deduct',
                    'Net Amount',
                ],
            ],
            body: (result?.ppoBillBreakups ?? []).map(
                (element: {
                    toDate: string;
                    revision: {
                        fromDate: string;
                        toDate: string;
                        rate: {
                            breakup: {
                                componentName: string;
                                componentType: string;
                            };
                        };
                    };
                    dueAmount: number;
                    drawnAmount: number;
                    netAmount: number;
                }) => [
                    `${element?.revision?.fromDate ?? 'N/A'} To ${
                        element?.toDate ?? 'N/A'
                    }`,
                    `${
                        element?.revision?.rate?.breakup?.componentName ?? 'N/A'
                    }`,
                    `${element?.dueAmount ?? 'N/A'}`,
                    `${element?.drawnAmount ?? 'N/A'}`,
                    `${
                        element?.revision?.rate?.breakup?.componentType ?? 'N/A'
                    }`,
                    `${element?.netAmount ?? 'N/A'}`,
                ]
            ),
            styles: {
                fontSize: 7,
            },
        });

        const tableHeight = (doc as any).autoTable.previous.finalY || 0;

        doc.text(
            `Bill Gross: ${result.grossAmount}   Bill Net :  ${result?.netAmount}\nBy-transfer:  ${result?.byTransferAmount}  `,
            20,
            tableHeight + 10
        );
        if (tableHeight > 160) {
            doc.addPage();

            doc.setLineWidth(0.001);
            doc.line(150, 150, 200, 150);
            doc.text('Treasury Officer/ Addl. Treasury officer', 150, 155);
            doc.line(150, 180, 200, 180);
            doc.text('Treasury Officer/ Addl. Treasury officer', 150, 185);
            doc.text('Date Of Issue Of Cheque.....\nCheque Number:', 20, 170);
            doc.text('INSTRUCTIONS', 50, 185);
            doc.text(
                "1. The Pensioner's Single / Joint named account with the family pensioner will be operated for drawal of pension only.\n2. In the event of the death of the Pensioner,the Bank will intimate the actual date of death of the pensioner and the Bank will not release the Balance in the\n account of the Pensioner unless clearance is received from Treasury.\n3. If the pension has remained undrawn for six months the Bank will send an intimation to that effect to the Treasury.",
                10,
                190
            );
            doc.text('T.O /A.T.O', 160, 220);
            doc.text(
                `Pay Rs. ***${result?.netAmount}(${result?.amountInWords})as per beneficiary list enclosed through ECS  `,
                10,
                20
            );
        } else {
            doc.setLineWidth(0.001);
            doc.line(150, tableHeight + 40, 200, tableHeight + 40);
            doc.text(
                'Treasury Officer/ Addl. Treasury officer',
                150,
                tableHeight + 45
            );
            doc.line(150, tableHeight + 70, 200, tableHeight + 70);
            doc.text(
                'Treasury Officer/ Addl. Treasury officer',
                150,
                tableHeight + 75
            );
            doc.text(
                'Date Of Issue Of Cheque.....\nCheque Number:',
                20,
                tableHeight + 60
            );
            doc.text('INSTRUCTIONS', 50, tableHeight + 75);
            doc.text(
                "1. The Pensioner's Single / Joint named account with the family pensioner will be operated for drawal of pension only.\n2. In the event of the death of the Pensioner,the Bank will intimate the actual date of death of the pensioner and the Bank will not release the Balance in the\n account of the Pensioner unless clearance is received from Treasury.\n3. If the pension has remained undrawn for six months the Bank will send an intimation to that effect to the Treasury.",
                10,
                tableHeight + 80
            );
            doc.text('T.O /A.T.O', 160, tableHeight + 110);
            doc.text(
                `Pay Rs. ***${result?.netAmount}(${result?.amountInWords})as per beneficiary list enclosed through ECS  `,
                10,
                tableHeight + 20
            );
        }

        const totalPages = doc.getNumberOfPages();
        for (let page = 1; page <= totalPages; page++) {
            doc.setPage(page); // Switch to the page
            doc.text(
                `Prepared By :    ${result?.preparedBy} `,
                10,
                doc.internal.pageSize.getHeight() - 10
            ); // Add footer
            doc.text(
                `Prepated On:    ${result?.preparedOn}`,
                doc.internal.pageSize.getWidth() - 10,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'right' }
            );
            if (page > 1) {
                doc.text(
                    `BILL NUMBER: ${result?.billNo}\nBILL DATE: ${result?.billDate}\nPPO ID: ${result?.pensioner?.ppoId}`,
                    10,
                    5
                );
                doc.text(
                    `PPO NUMBER:${result?.pensioner?.ppoNo}`,
                    doc.internal.pageSize.getWidth() - 10,
                    5,
                    { align: 'right' }
                );
            }
        }

        const pdfData = doc.output('datauristring');
        this.dialog.open(FirstPensionPdfViewerComponent, {
            header: 'First Pension Bill',
            width: '70%',
            height: '100%',
            data: {
                message: `PDF has been generated.`,
                pdfData,
            },
        });
    }
}
