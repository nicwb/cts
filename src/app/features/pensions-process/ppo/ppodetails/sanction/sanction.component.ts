import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import {
    APIResponseStatus,
    PensionerResponseDTOJsonAPIResponse,
    PensionFactoryService,
    PensionPPODetailsService,
    PensionSanctionDetailsService,
    PpoSanctionDetailsResponseDTO,
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-sanction',
    templateUrl: './sanction.component.html',
    styleUrls: ['./sanction.component.scss'],
})
export class SanctionComponent implements OnInit {
    sanctionDetails: FormGroup = new FormGroup({});
    ppoId?: any;
    sanctionId: any;
    isShowButton: boolean = false;
    originalValues?: PpoSanctionDetailsResponseDTO;
    genderOptions: SelectItem[] = [];

    response!: PensionerResponseDTOJsonAPIResponse;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private PensionPPODetailsService: PensionPPODetailsService,
        private PensionSanctionDetailsService: PensionSanctionDetailsService,
        private toastservice: ToastService,
        private fakeservice: PensionFactoryService
    ) {}
    async ngOnInit(): Promise<void> {
        this.sanctionDetails = this.fb.group({
            ppoId: [null, Validators.required],
            pensionerId: [null, Validators.required],
            employeeName: ['', Validators.required],
            sanctionAuthority: ['', Validators.required],
            sanctionNo: ['', Validators.required],
            sanctionDate: ['', Validators.required],
            employeeDob: [''],
            employeeGender: [],
            employeeDateOfAppointment: [''],
            employeeOffice: [],
            employeeDesignation: [],
            employeeLastPay: [null],
            averageEmolument: [null],
            employeeHrmsId: [null],
            issuingAuthority: [null],
            issuingLetterNo: [null],
            issuingLetterDate: [''],
            qualifyingServiceGrossYears: [null],
            qualifyingServiceGrossMonths: [null],
            qualifyingServiceGrossDays: [null],
            qualifyingServiceNetYears: [null],
            qualifyingServiceNetMonths: [],
            qualifyingServiceNetDays: [],
        });

        this.route.paramMap.subscribe((params) => {
            this.ppoId = params.get('ppoId') || undefined; // Get ppoId from the route parameters
            if (this.ppoId) {
                const ppoidNumber = Number(this.ppoId);
                this.fetchPensionerDetails(ppoidNumber);
                // this.getData(ppoidNumber)
            }
        });

        this.genderOptions = [
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
        ];

        if (!environment.production) {
            await this.getFakedata();
        }
    }

    async fetchPensionerDetails(ppoId: any): Promise<void> {
        if (ppoId) {
            try {
                this.response = await firstValueFrom(
                    this.PensionPPODetailsService.getPensionerByPpoId(ppoId)
                );
                if (this.response) {
                    if (
                        this.response.apiResponseStatus ==
                        APIResponseStatus.Success
                    ) {
                        this.sanctionDetails.patchValue({
                            employeeName: this.response.result?.pensionerName,
                            ppoId: this.response.result?.ppoId,
                            pensionerId: this.response.result?.id,
                        });
                        if (this.response.result?.ppoSanctionDetails?.[0]?.id) {
                            this.sanctionId =
                                this.response.result.ppoSanctionDetails[0].id;

                            try {
                                const sanction = await firstValueFrom(
                                    this.PensionSanctionDetailsService.getSanctionDetailsById(
                                        this.sanctionId
                                    )
                                );

                                if (
                                    sanction.apiResponseStatus ===
                                        APIResponseStatus.Success &&
                                    sanction.result
                                ) {
                                    this.sanctionDetails.patchValue({
                                        ...sanction.result, // Spread the result to avoid multiple patchValue calls
                                        sanctionDate:
                                            this.convertYyyyMmDdToDdMmYyyy(
                                                sanction.result.sanctionDate
                                            ), // Include sanctionDate explicitly if needed
                                        employeeDob:
                                            this.convertYyyyMmDdToDdMmYyyy(
                                                sanction.result.employeeDob ??
                                                    ''
                                            ),
                                        issuingLetterDate:
                                            this.convertYyyyMmDdToDdMmYyyy(
                                                sanction.result
                                                    .issuingLetterDate ?? ''
                                            ),
                                        employeeDateOfAppointment:
                                            this.convertYyyyMmDdToDdMmYyyy(
                                                sanction.result
                                                    .employeeDateOfAppointment ??
                                                    ''
                                            ),
                                    });

                                    this.originalValues = {
                                        ...sanction.result,
                                    }; // Ensure a new reference is created
                                    this.isShowButton = true;
                                } else {
                                    console.warn(
                                        'Sanction details fetch failed with status:',
                                        sanction.apiResponseStatus
                                    );
                                }
                            } catch (error) {
                                console.error(
                                    'Error fetching sanction details:',
                                    error
                                );
                            }
                        }
                    }
                } else {
                    console.warn(
                        'No pensioner details found for PPO ID:',
                        this.ppoId
                    );
                }
            } catch (error) {
                console.error('Failed to fetch pensioner details:', error);
            }
        } else {
            console.warn('No PPO ID provided');
        }
    }

    async postSenctionDetails() {
        if (this.sanctionDetails.valid) {
            try {
                const sanctionDetails = this.sanctionDetails.value;
                [
                    'employeeDateOfAppointment',
                    'employeeDob',
                    'issuingLetterDate',
                    'sanctionDate',
                ].forEach((dateField) => {
                    if (sanctionDetails[dateField]) {
                        sanctionDetails[dateField] = this.formatDate(
                            sanctionDetails[dateField]
                        );
                    } else if (dateField === 'sanctionDate') {
                        throw new Error('Sanction Date is required'); // Ensure sanctionDate is present.
                    } else {
                        sanctionDetails[dateField] = null; // Set other dates to null if not provided.
                    }
                });
                const response = await firstValueFrom(
                    this.PensionSanctionDetailsService.createSanctionDetails(
                        sanctionDetails
                    )
                );
                if (response.apiResponseStatus === APIResponseStatus.Success) {
                    this.toastservice.showSuccess(response.message ?? '');
                    this.isShowButton = true;
                } else if (
                    response.apiResponseStatus === APIResponseStatus.Error
                ) {
                    this.toastservice.showError(response.message ?? '');
                }
            } catch {
                this.toastservice.showError(
                    'Something went wrong. Please try again.'
                );
            }
        }
    }

    async updateSanctionDetails() {
        try {
            const formValue = this.sanctionDetails.value;
            formValue.employeeDob = this.formatDate(formValue.employeeDob);
            formValue.sanctionDate = this.formatDate(formValue.sanctionDate);
            formValue.employeeDateOfAppointment = this.formatDate(
                formValue.employeeDateOfAppointment
            );
            formValue.issuingLetterDate = this.formatDate(
                formValue.issuingLetterDate
            );
            const update = await firstValueFrom(
                this.PensionSanctionDetailsService.updateSanctionDetailsById(
                    this.sanctionId,
                    formValue
                )
            );

            // Handle the response
            if (update.apiResponseStatus === APIResponseStatus.Success) {
                this.toastservice.showSuccess(
                    update.message ?? 'Sanction details updated successfully!'
                );
                this.originalValues = formValue; // Update original values to the new values
            } else if (update.apiResponseStatus === APIResponseStatus.Error) {
                this.toastservice.showError(
                    update.message ?? 'Failed to update sanction details.'
                );
            }
        } catch (error) {
            console.error('Error updating sanction details:', error);
            this.toastservice.showError(
                'Something went wrong. Please try again.'
            );
        }
    }
    formatDate(dateString: string): string | null {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return null; // Return null for invalid dates
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Returns the formatted date
    }

    convertYyyyMmDdToDdMmYyyy(dateString: string | undefined): string | null {
        if (!dateString) return null;

        const parts = dateString.split('-');
        if (parts.length !== 3) {
            console.warn(`Invalid date format: "${dateString}"`);
            return null;
        }
        const [year, month, day] = parts;
        return `${year}-${month}-${day}`;
    }
    // get fake data for new sanction entry
    async getFakedata() {
        const fake = await firstValueFrom(
            this.fakeservice.createFake('PpoSanctionDetailsEntryDTO')
        );
        if (fake.apiResponseStatus === APIResponseStatus.Success) {
            if (fake && fake.result) {
                this.sanctionDetails.patchValue({
                    ...fake.result,
                    ppoId: this.response.result?.ppoId,
                    pensionerId: this.response.result?.id,
                    employeeName: this.response.result?.pensionerName,
                });
                this.isShowButton = false;
            } else {
                console.warn('No valid result found in fake data:', fake);
            }
        }
    }
}
