import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { SessionStorageService } from './../services/session-storage.service';

@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.html',
    styleUrls: ['./dynamic-table.scss']
})
export class DynamicTableComponent implements OnInit {
    @Input() service$?: Observable<any> | null | undefined;
    @Input() data: { headers: any; data: any } = { headers: [], data: [] };
    @Input() name: string = '';
    @Input() style: any = { width: 'auto' };
    @Input() suffix: string = '';
    @Input() editable:boolean=false;
    @Output() return = new EventEmitter<any>();

    @Output() loads = new EventEmitter<any>();

    display: boolean = false;
    records: any[] = []; // The original dataset
    filteredRecords: any[] = []; // Records filtered by search
    cols: any[] = [];
    searchTerm: string = ''; // Bound to search input field
    onresult: string = '';
    totalRecords = 0;
    isLoading: boolean = false;
    rows: number = 10; // Number of rows per page, initially set to 10
    first: number = 0; // Start index for pagination
    scrollable:boolean=true;

    debugState?: boolean;
    expand:boolean=false;


    constructor(private session: SessionStorageService) {}

    ngOnInit(): void {
        this.showDialog();
    }
    rowExpand(){
        this.isLoading=true;
        this.expand=!this.expand;
        this.scrollable=false;
        this.isLoading=false;

    }
    rowCollaps(){
        this.isLoading=true;
        this.expand=!this.expand;
        this.scrollable=true;
        this.isLoading=false;
    }

    editButton(event:any){
        if (event) {
            this.return.emit(event);
        }
    }

    async showDialog() {
        this.isLoading = true;
        await this.callService();

        if (this.data) {
            const { headers, data } = this.data;
            this.records = this.data.data; // Store the full dataset
            this.filteredRecords = [...this.records]; // Initialize filtered records with the full dataset

            if (headers) {
                this.cols = headers.map((header: any) => ({
                    field: header.fieldName,
                    header: header.name
                }));
            }
        }

        this.totalRecords = this.filteredRecords.length; // Set total records to filtered records
        this.display = true;
        this.isLoading = false;
    }

    async callService() {
        if (this.service$) {
            try {
                const dataget = await this.session.cacheWithExpiry(this,async () => {
                    if (this.service$) {
                        return await firstValueFrom(this.service$.pipe(tap((response) => {
                            if (response.result && response.result.data) {
                                return response.result.data;
                            } else {
                                this.debug(response);
                            }
                        })));
                    }
                },this.suffix);
                this.dataset(dataget);
            } catch (error) {
                this.debug(['Error in getting data from cache:', error]);
            }

            this.isLoading = false;
        }
    }

    dataset(response: any) {
        this.data = response.result;
        this.records = this.data.data; // Store the original data
        this.filteredRecords = [...this.records]; // Initialize filtered data
        this.totalRecords = this.filteredRecords.length;
    }

    // Search functionality that filters the data based on the search term
    searchRecords() {
        const lowerCaseSearchTerm = this.searchTerm.toLowerCase();

        if (this.searchTerm) {
            this.filteredRecords = this.records.filter((record) =>Object.values(record).some((value) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    return value.toString().toLowerCase().includes(lowerCaseSearchTerm);
                }
                return false;
            }));
            this.data.data=this.filteredRecords;
        } else {
            this.filteredRecords = [...this.records];
            this.data.data=this.filteredRecords;

        }

        // Reset pagination when search changes
        this.first = 0;

        // Update total record count for the paginator
        this.totalRecords = this.filteredRecords.length;

        // Display no results message if necessary
        this.onresult = this.filteredRecords.length === 0 ? 'No records found' : '';
    }

    // Custom sort function
    customSort(event: any) {
        const field = event.field;
        const order = event.order;

        this.filteredRecords.sort((a, b) => {
            const value1 = a[field];
            const value2 = b[field];

            let result = null;
            if (typeof value1 === 'string' && typeof value2 === 'string') {
                result = value1.localeCompare(value2);
            } else {
                result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
            }

            return order * result; // Apply the sort order
        });

        // Reset pagination when sorting
        this.first = 0;

        // Update total record count for the paginator
        this.totalRecords = this.filteredRecords.length;
    }

    debug(msg: any) {
        if (this.debugState) {
            console.log(msg);
        }
    }
}
