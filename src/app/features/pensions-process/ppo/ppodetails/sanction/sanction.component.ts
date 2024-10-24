import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { APIResponseStatus, PensionPPODetailsService} from 'src/app/api';
import { pensionerStatusDTO } from 'src/app/core/models/pensioner-status';


@Component({
    selector: 'app-sanction',
    templateUrl: './sanction.component.html',
    styleUrls: ['./sanction.component.scss']
})

export class SanctionComponent implements OnInit {
    sanctionDetails: FormGroup = new FormGroup({});
    ppoId?: any;

    constructor(private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private PensionPPODetailsService: PensionPPODetailsService,

    ) {

    }
    ngOnInit(): void {
        this.sanctionDetails = this.fb.group({
            ppoId:['', Validators.required],
            pensionerId: ['', Validators.required],
            employeeName: ['', Validators.required],
            sanctionAuthority: ['', Validators.required],
            sanctionNo: ['', Validators.required],
            sanctionDate: ['', Validators.required],
            employeeDob: ['', Validators.required],
            employeeGender: ['', Validators.required],
            employeeDateOfAppointment: ['', Validators.required],
            employeeOffice: ['', Validators.required],
            employeeDesignation: ['', Validators.required],
            employeeLastPay: ['', Validators.required],
            averageEmolument: ['', Validators.required],
            employeeHrmsId: ['', Validators.required],
            issuingAuthority: ['', Validators.required],
            issuingLetterNo: ['', Validators.required],
            issuingLetterDate: ['', Validators.required],
            qualifyingServiceGrossYears: ['', Validators.required],
            qualifyingServiceGrossMonths: ['', Validators.required],
            qualifyingServiceGrossDays: ['', Validators.required],
            qualifyingServiceNetYears: [''],
            qualifyingServiceNetMonths: [''],
            qualifyingServiceNetDays: ['']
        });

        this.route.paramMap.subscribe(params => {
            this.ppoId = params.get('ppoId') || undefined; // Get ppoId from the route parameters
            console.log('Extracted PPO ID:', this.ppoId); // Log the extracted PPO ID
            if (this.ppoId) {
                const ppoidNumber = Number(this.ppoId);
                this.fetchPensionerDetails(ppoidNumber);
                // this.getData(ppoidNumber)
            }
        });
    }

    async fetchPensionerDetails(ppoId: any): Promise<void> {
        if (ppoId) {
            try {
                const response = await firstValueFrom(
                    this.PensionPPODetailsService.getPensionerByPpoId(ppoId)
                );
                if (response) {
                    if (response.apiResponseStatus == APIResponseStatus.Success) {
                        this.sanctionDetails.patchValue({
                            employeeName: response.result?.pensionerName,
                            ppoId: response.result?.ppoId,
                            pensionerId: response.result?.id

                        })
                    }
                    console.log('Pensioner Details:', response);
                    // Handle the response as needed (e.g., assign to component property)
                    //   this.pensionerDetails = response;
                } else {
                    console.warn('No pensioner details found for PPO ID:', this.ppoId);
                }
            } catch (error) {
                console.error('Failed to fetch pensioner details:', error);
            }
        } else {
            console.warn('No PPO ID provided');
        }
    }

    postSenctionDetails(){
        if(this.sanctionDetails.valid){
            // const response = await firstValueFrom()
        }
    }



}



