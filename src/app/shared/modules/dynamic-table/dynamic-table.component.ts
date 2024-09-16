import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TrackByFunction,
    Type,
} from '@angular/core';
import { Message } from 'primeng/api/message';
import {
    DynamicTable,
    DynamicTableQueryParameters,
    FilterEnum,
    FilterParameter,
    ActionButtonConfig,
    ActionButtonEvent,
    TableHeader,
    SortParameter,
} from 'src/app/core/models/dynamic-table';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss'],

})
export class DynamicTableComponent implements OnInit {
    [x: string]: any;
    /**
     * small
     * normal 
     * large
     */
    @Input()
        size: string = '';
    @Input()
        headers: TableHeader[] = [];
    @Input()
        data: any;
    @Input()
        dataCount: number = 0;
    @Input()
        numberRowsShown: number = 10;
    @Input()
        rowsPerPageOptions: any[] = [10, 20, 30];
    @Input()
        actionButtons: ActionButtonConfig[]=[];
    /**
     * none
     * single 
     * multiple
     */
    @Input()
        rowSelectionMode: string = 'none';

    @Output()
        rowSelect = new EventEmitter<any>();
    @Output()
        actionButtonClicked = new EventEmitter<any>();
    @Output()
        queryParameterChange = new EventEmitter<any>();
    sizes!: any[];
    filterParams: FilterParameter[] = [];
    selectedRows: any;
    sortParams: SortParameter | any;
    sortOrder: number | any;
    pageSize: number = 10;
    pageIndex: number = 0;
    sortField: string | any;
    errors: Message[] = [];
    items!: MenuItem[];
    items1!: MenuItem[];
    @Output() searchKeyChange: EventEmitter<string> = new EventEmitter<string>();
    searchKey: string = '';
    cols!: any[];
    exportColumns!: any[];
    ngOnInit(): void {
        // console.log('header', this.headers);
        console.log('header', this.data);
        this.exportColumns = this.headers.map(col => ({ title: col.name, dataKey: col.fieldName }));
        if (this.headers.length == 0) {
            this.errors.push({ severity: 'error', summary: 'Header Miesing!', detail: 'Message Content' });
        }
        if (this.dataCount == 0) {
            this.errors.push({ severity: 'error', summary: 'Data Count mesing', detail: 'Message Content' });
        }
        // console.log(this.errors);

        this.sizes = [
            { name: 'small', class: 'p-datatable-sm' },
            { name: 'normal', class: '' },
            { name: 'large', class: 'p-datatable-lg' }
        ];
        this.items = [
            {
                label: 'Export All',
                icon: 'pi pi-copy',
                command: () => { this.exportExcel()}
            },
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                command: () =>{this.exportExcelSelected()}
            },
        ];

        this.items1 = [
            {
                label: 'Export All',
                icon: 'pi pi-copy',
                command: () => {this.exportPdf() }
            },
            {
                label: 'Export Selected',
                icon: 'pi pi-check-square',
                command: () =>{this.exportPdfSelected()}
            },
        ];
    }
    //[Event]==================================================================
    emitButtonClickEvent(data: any, buttonType: string) {
        const actionButtonEventProperties: ActionButtonEvent = {
            buttonIdentifier: buttonType,
            rowData: data,
        };
        this.actionButtonClicked.emit(actionButtonEventProperties);
    }
    emitRowSelectEvent() {
        if (this.rowSelectionMode === 'single') {
            const parentIdToLastIndex = new Map<number, number>();
            for (let i = this.selectedRows.length - 1; i >= 0; i--) {
                const item = this.selectedRows[i];
                if (!parentIdToLastIndex.has(item.parentId)) {
                    parentIdToLastIndex.set(item.parentId, i);
                }
            }

            for (let i = this.selectedRows.length - 1; i >= 0; i--) {
                const item = this.selectedRows[i];
                const lastIndex = parentIdToLastIndex.get(item.parentId);
                if (i !== lastIndex) {
                    this.selectedRows.splice(i, 1);
                }
            }
        }
        this.rowSelect.emit(this.selectedRows);
    }
    emitQueryParameterChange() {
        const queryParameters: DynamicTableQueryParameters = {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            filterParameters: this.filterParams,
            sortParameters: this.sortParams,
        };
        this.queryParameterChange.emit(queryParameters);
    }
    //[Event END]==============================================================

    //[Filter]=================================================================
    onFilter(event: any) {
        const originalObject = event.filters;
        const convertedFilters: FilterParameter[] = [];
        // Store previously processed filters to avoid duplicates
        const processedFilters = new Set<string>();
        for (const key in originalObject) {
            const filterObject = originalObject[key][0];

            // Check if value has changed and filter hasn't been processed
            const filterKey = `${key}-${filterObject.value}`;
            if (
                filterObject.value !== null &&
                !processedFilters.has(filterKey)
            ) {
                processedFilters.add(filterKey);
                convertedFilters.push({
                    field: this.getFilterField(key, this.headers),
                    value: filterObject.value.toString(),
                    operator: filterObject.matchMode,
                });
            }
        }

        // Update filterParams only if there are changes
        if (
            JSON.stringify(this.filterParams) !==
            JSON.stringify(convertedFilters)
        ) {
            this.filterParams = convertedFilters;
            this.emitQueryParameterChange();
            // this.getData();
        }
    }
    //[Filter END]=============================================================

    //[Sorting]================================================================
    onSortChange(event: any) {
        const incomingShortParameter: SortParameter = {
            field: event.field,
            order: event.order === 1 ? 'ASC' : 'DESC',
        };
        if (
            JSON.stringify(this.sortParams) !=
            JSON.stringify(incomingShortParameter)
        ) {
            this.sortParams = incomingShortParameter;
            this.emitQueryParameterChange();
            // this.getData();
        }
    }
    //[Sorting END]============================================================
    //[Pagination]=============================================================
    onPageChange($event: any) {
        if (this.pageSize != $event.rows || this.pageIndex != $event.page) {
            this.pageIndex = $event.page;
            this.pageSize = $event.rows;
            this.emitQueryParameterChange();
            // this.getData();
        }
    }
    //[Pagination END]=========================================================

    //[Helper functions]=======================================================
    lowercaseFirstLetter(input: string): string {
        const [firstLetter, ...rest] = input;
        return `${firstLetter.toLowerCase()}${rest.join('')}`;
    }
    uppercaseFirstLetter(input: string): string {
        const [firstLetter, ...rest] = input;
        return `${firstLetter.toLocaleUpperCase()}${rest.join('')}`;
    }
    getFilterField(fieldName: string, objects: TableHeader[]): string {
        const foundObject = objects.find(obj => obj.fieldName === fieldName);
        return foundObject ? foundObject.filterField : "";
    }
    getEnumStyle(enumValue: number, objects: FilterEnum[]): string {
        const foundObject = objects.find(obj => obj.value === enumValue);
        return foundObject ? foundObject.styleClass : "";
    }
    getTableSizeClass(size: string) {
        const foundObject = this.sizes.find(obj => obj.name === size);
        return foundObject ? foundObject.class : "";
    }

    globalSearch(searchKey: string) {
        this.searchKeyChange.emit(searchKey);
    }

    clearFilters() {

    }

    // exportHandler(type: string) {
    //     if (type === 'excel') {
           
    //             this.exportExcel();
           
    //     } else if (type === 'pdf') {
         
          
    //             this.exportPdf();
           
    //     }
    // }
    

    exportPdf() {
        console.log('d');
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.data);
                doc.save('products.pdf');
            })
        })
    }

    exportPdfSelected() {
        console.log('d');
        import("jspdf").then(jsPDF => {
            import("jspdf-autotable").then(x => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.selectedRows);
                doc.save('products.pdf');
            })
        })
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.data);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "data");
        });    
    }

    exportExcelSelected() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.selectedRows);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "data");
        });    
    }
    trackByFunc: TrackByFunction<ActionButtonConfig> = (index, item) => {
        return index; // Assuming each actionButton has a unique 'id' property
    };
    //[Helper functions END]===================================================
}
