import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import {
    PensionComponentRateService,
    PensionCategoryMasterService,
    ComponentRateResponseDTOIEnumerableDynamicListResultJsonAPIResponse
} from 'src/app/api';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-component-rate-revisions',
    templateUrl: './component-rate-revisions.component.html',
    styleUrls: ['./component-rate-revisions.component.scss']
})
export class ComponentRateRevisionsComponent implements OnInit {
    pensionCategoryIdComponent$?: Observable<any>;
    PensionComponentRateForm: FormGroup;
    responseData?: ComponentRateResponseDTOIEnumerableDynamicListResultJsonAPIResponse;
    cols: any[] = [];
    records: any[] = [];
    tableData: any[] = [];
    loading: boolean = false;
    showTable = false;

    constructor(
        private pensionCategoryMasterService: PensionCategoryMasterService,
        private pensionComponentRateService: PensionComponentRateService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.PensionComponentRateForm = this.formBuilder.group({
            categoryId: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.initializeCategoryIdComponent();
    }

    initializeCategoryIdComponent(): void {
        const payload = {
            pageSize: 10,
            pageIndex: 0,
            filterParameters: [],
            sortParameters: {
                field: '',
                order: '',
            },
        };

        this.pensionCategoryIdComponent$ = this.pensionCategoryMasterService.getAllCategories(payload);
    }

    openNewComponentRateForm(): void {
        const routePath = '/master/component-rate'; 
        console.log('Navigating to component-rate');
        this.router.navigateByUrl(routePath)
            .then(success => {
                if (success) {
                    console.log('Navigation successful');
                } else {
                    console.error('Navigation failed');
                }
            })
            .catch(err => {
                console.error('Navigation error:', err);
            });
    }
    
    handleCategoryIdSearchEvent(event: any): void {
        this.PensionComponentRateForm.patchValue({
            categoryId: event.id,
            description: event.categoryName
        });
    }

    onSearch(): void {
        this.showTable = true;
        if (this.PensionComponentRateForm.valid) {
            this.loading = true;
            const categoryId = this.PensionComponentRateForm.get('categoryId')?.value;
    
            firstValueFrom(
                this.pensionComponentRateService.getComponentRatesByCategoryId(categoryId)
            ).then((response: ComponentRateResponseDTOIEnumerableDynamicListResultJsonAPIResponse) => {
                if (response.apiResponseStatus === 'Success' && response.result) {
                    this.tableData = response.result.data || [];
                    this.setupTableColumns(response.result.headers || []);
                } else {
                    this.toastService.showError(response.message || 'Error fetching component rates');
                }
                this.loading = false;
            }).catch((error) => {
                this.toastService.showError(error);
                this.loading = false;
            });
        }
    }
    
    setupTableColumns(headers: any[]): void {
        this.cols = headers.map(header => ({
            field: header.fieldName,
            header: header.name
        }));
    }

    resetAndReload(): void {
        this.showTable = false;
        this.PensionComponentRateForm.reset();
        this.responseData = undefined;
        this.records = [];
        this.cols = [];
    }
}