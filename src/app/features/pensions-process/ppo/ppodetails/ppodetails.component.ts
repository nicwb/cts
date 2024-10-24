import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { firstValueFrom, Observable, tap, catchError, EMPTY } from 'rxjs';
import { APIResponseStatus, PensionPPODetailsService } from 'src/app/api';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
// Define the interface for the records
interface PPORecord {
    [key: string]: any;
}

// Define the interface for the data
interface PPOData {
    headers: Array<{ fieldName: string; name: string }>;
    data: PPORecord[];
}

@Component({
    selector: 'app-ppodetails',
    templateUrl: './ppodetails.component.html',
    styleUrls: ['./ppodetails.component.scss'],
})
export class PpodetailsComponent implements OnDestroy {
    currentStepIndex = 0;
    steps = [
        { label: 'PPO Details' },
        { label: 'Sanction Details' },
        { label: 'Family Nominee' },
    ];
    isFormValid = false;
    allPPOs$?: Observable<any>;
    viewMode = true;
    ppoSearchField = '';
    records: PPORecord[] = [];
    cols: Array<{ field: string; header: string }> = [];
    data: PPOData = { headers: [], data: [] };
    tableMsg = '';
    isLoading = false;
    tableVisible = false;

    ppoId?: any;
    pensionerName?: string;
    lastPathSegment: string | null = null;  // Change type to include null

    routeOb: any;
    pathOb: any;

    constructor(
        private toastService: ToastService,
        private ppoDetialsService: PensionPPODetailsService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        this.detectRoutes();
    }
    ngOnDestroy(): void {
        if (this.routeOb && this.pathOb) {
            this.routeOb.unsubscribe();
            this.pathOb.unsubscribe();
        }
    }

    toggleTableVisibility(): void {
        this.tableVisible = !this.tableVisible;
        if (this.tableVisible) {
            this.loadPPOData();
        }
    }

    detectRoutes(): void {
        // Subscribe to route paramMap to get the ppoId
        this.routeOb = this.route.paramMap.subscribe(params => {
            const routePpoId = params.get('ppoId');
            if (routePpoId) {
                this.ppoId = routePpoId;
                this.viewChange(false);
            }
        });
        this.loadById();
        // Subscribe to router events to get the current URL and extract the last segment
        this.pathOb = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const stepParam = this.route.snapshot.queryParamMap.get('step'); // Get 'step' query param
                const lastSegment = this.route.snapshot.url.slice(-1)[0].path;

                if (lastSegment === 'new') { this.newPPOEntry(); return };
            }
        });
    }

    async loadById() {
        // if (this.ppoId) {
        //     await firstValueFrom(this.ppoDetialsService.getPensionerByPpoId(Number(this.ppoId)).pipe(
        //         tap(
        //             res => {
        //                 if (!res.result) {
        //                     this.toastService.showError("PPO ID is invalid");
        //                     return;
        //                 }
        //                 this.pensionerName = res.result.pensionerName;
        //                 this.cdr.detectChanges()
        //             }
        //         )
        //     ))
        // }
    }

    ngOnInit(): void {
        // Extract `ppoId` from the route params if needed
        this.ppoId = Number(this.route.snapshot.paramMap.get('ppoId'));

        // Read the `step` query parameter and set the current step index.
        const stepParam = this.route.snapshot.queryParamMap.get('step');
        this.currentStepIndex = stepParam ? parseInt(stepParam, 10) : 0;

        console.log(`Initialized at step ${this.currentStepIndex}`);
    }

    next(): void {
        if (!this.ppoId) {
            console.warn('PPO ID is missing. Cannot proceed to the next step.');
            return;
        }

        const nextStep = this.currentStepIndex + 1;
        const maxStep = 3; // Adjust as needed.

        if (nextStep > maxStep) {
            console.log('All steps completed.');
            return;
        }

        // Navigate to the next step.
        this.router.navigate(
            ['pension-process/ppo', this.ppoId, 'edit'],
            { queryParams: { step: nextStep } }
        ).then(() => {
            this.currentStepIndex = nextStep;
            console.log(`Navigated to step ${nextStep}`);
        }).catch((error) => {
            console.error('Navigation error:', error);
        });
    }

    private getLastPathSegment(url: string): string | null {
        const segments = url.split('/').filter(segment => segment.length > 0);
        return segments.length > 0 ? segments[segments.length - 1] : null;
    }

    private async loadPPOData(): Promise<void> {
        this.isLoading = true;
        try {
            let payload = {
                pageSize: 10,
                pageIndex: 0,
                filterParameters: [],
                sortParameters: { field: '', order: '' },
            };

            this.allPPOs$ = this.ppoDetialsService.getAllPensioners(payload);
            await firstValueFrom(
                this.allPPOs$.pipe(
                    tap(result => this.handleResponse(result)),
                    catchError(error => this.handleError(error))
                )
            );
        } finally {
            this.isLoading = false;
        }
    }

    private handleResponse(response: any): void {
        if (response && response.result) {
            this.data = response.result;
            this.records = this.data.data;
            this.cols = this.data.headers.map((header: any) => ({
                field: header.fieldName,
                header: header.name,
            }));
        } else {
            this.tableMsg = 'No data available';
        }
    }

    private handleError(error: any): Observable<never> {
        this.toastService.showError('Failed to connect server!');
        this.tableMsg = 'Failed to connect server!';
        return EMPTY;
    }

    prev(): void {
        if (!this.ppoId) {
            console.warn('PPO ID is missing. Cannot go to the previous step.');
            return;
        }

        const previousStep = this.currentStepIndex - 1;

        if (previousStep >= 0) {
            // Update the step and navigate to the previous step.
            this.currentStepIndex = previousStep;
            this.router.navigate(
                ['pension-process/ppo', this.ppoId, 'edit'],
                { queryParams: { step: previousStep } }
            ).then(() => {
                console.log(`Navigated to step ${previousStep}`);
                this.currentStepIndex = previousStep;
            }).catch((error) => {
                console.error('Navigation error:', error);
            });
        } else {
            console.log('Already at the first step');
        }
    }


    viewChange(state: boolean): void {
        if (state) {
            this.loadPPOData();
        } else {
            this.viewMode = false;
        }
    }

    newPPOEntry(): void {
        this.ppoId = undefined;
        this.viewMode = false;
        this.cdr.detectChanges();
    }

    addNewEntry() {
        this.router.navigate(['pension-process/ppo/entry/new']);
    }

    search(): void {
        this.tableMsg = '';

        if (this.ppoSearchField.trim() === '') {
            this.data.data = [...this.records];
            return;
        }

        const lowerCaseSearchTerm = this.ppoSearchField.toLowerCase();

        this.data.data = this.records.filter(record =>
            Object.values(record).some(value =>
                typeof value === 'string' || typeof value === 'number'
                    ? value.toString().toLowerCase().includes(lowerCaseSearchTerm)
                    : false
            )
        );

        if (this.data.data.length === 0) {
            this.tableMsg = 'No records found';
        }
    }

    editThisRecord(record: PPORecord): void {
        const currentStep = this.currentStepIndex;
        const nextStep = currentStep + 1;
        const maxStep = 3; // Adjust as needed
        if (nextStep > maxStep) {
            console.log('All steps completed');
            return;
        }
        if (record['ppoId']) {
            this.router.navigate(['pension-process/ppo', record['ppoId'], 'edit'], {
                queryParams: { step: 0 }
            });
        }
    }

    // get data using ppoid



    setPpoId(id: any) {
        if (id) {
            this.ppoId = id[0];
            this.pensionerName = id[1];
            this.cdr.detectChanges();
        }
    }
}
