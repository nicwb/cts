import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { firstValueFrom, Observable, tap, catchError, EMPTY } from 'rxjs';
import { PensionPPODetailsService } from 'src/app/api';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {Location} from '@angular/common';
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
export class PpodetailsComponent implements OnInit,OnDestroy {
    currentStepIndex = 0;
    steps = [
        { label: 'PPO Details' },
        { label: 'Bank Details' },
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

    // component data
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
        this.pathOb =  this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.lastPathSegment = this.getLastPathSegment(event.urlAfterRedirects);
  
                switch (this.lastPathSegment?.split('?')[0]) {
                case 'bank-account':
                    this.currentStepIndex = 1;
                    break;
                case 'new':
                    this.newPPOEntry();
                    break;
                case 'edit':
                    this.cdr.detectChanges();
                    break;
                default:
                    break;
                }
            }
        });
    }

    async loadById(){
        if (this.ppoId) {
            await firstValueFrom(this.ppoDetialsService.getPensionerByPpoId(Number(this.ppoId)).pipe(
                tap(
                    res => {
                        if (!res.result) {
                            this.toastService.showError("PPO ID is invalid");
                            return;
                        }
                        this.pensionerName = res.result.pensionerName;
                        this.cdr.detectChanges()
                    }
                )
            ))
        }
    }

    ngOnInit(): void {
        this.loadPPOData();
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

    next(): void {
        if (!this.ppoId) {
            return;
        }
        switch(this.currentStepIndex){
        case 0:
            this.currentStepIndex=1;
            this.router.navigate(['/pension/modules/pension-process/ppo/entry/',this.ppoId,'bank-account']);
            break;
        case 1:
            this.currentStepIndex=2;
            break;
        case 2:
            this.currentStepIndex=3;
            break;
        case 3:
            this.currentStepIndex=0;
            break;
        default:
            this.currentStepIndex=0;
            this.viewChange(true);
            break;
        }
    }

    prev(): void {
        if(this.ppoId){
            this.router.navigate(['/pension/modules/pension-process/ppo/entry/',this.ppoId,'edit']); 
        }
        else{
            this.location.back()
        }
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
        } else {
            this.viewMode = true;
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

    addNewEntry(){
        this.router.navigate(['/pension/modules/pension-process/ppo/entry/new']);
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
        if (record['ppoId']) {
            this.router.navigate(['/pension/modules/pension-process/ppo/entry/',record['ppoId'],'edit']);
        }
    }

    setPpoId(id: any) {
        if (id) {
            this.ppoId = id[0];
            this.pensionerName = id[1];
            this.cdr.detectChanges();
            // Optionally navigate to the next step
            // this.next();
        }
    }
}
