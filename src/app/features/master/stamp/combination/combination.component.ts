import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { GetStampCombinations } from 'src/app/core/models/stamp';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { StampCombinationService } from 'src/app/core/services/stamp/stamp-combination.service';
@Component({
    selector: 'app-combination',
    templateUrl: './combination.component.html',
    styleUrls: ['./combination.component.scss']
})
export class CombinationComponent implements OnInit {

    tableActionButton: ActionButtonConfig[] = [];
    tableData!: DynamicTable<GetStampCombinations>;
    tableQueryParameters!: DynamicTableQueryParameters | any;

    constructor(
    private stampCombinationService: StampCombinationService,
    private toastService: ToastService,
    private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.tableActionButton = [
            {
                buttonIdentifier: 'delete',
                class: 'p-button-danger p-button-sm',
                icon: 'pi pi-trash',
                lable: 'Delete',
            },
        ];

        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };

        this.getAllStampCombination();
    }

    getAllStampCombination() {
        console.log(this.tableQueryParameters);
    
        this.stampCombinationService
            .getStampCombinationList(this.tableQueryParameters)
            .subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    response.result.data.map((item: any) => {
                        item.isActive = item.isActive ? "Yes" : "No";
                        item.createdAt && (item.createdAt = convertDate(item.createdAt));
                    });
                    this.tableData = response.result;
                } else {
                    this.toastService.showAlert(
                        response.message,
                        response.apiResponseStatus
                    );
                }
            });
    }

    handleButtonClick($event: any) {
        this.stampCombinationService.deleteStampCombination($event.rowData.stampCategoryId)
            .subscribe((response) => {
                response.apiResponseStatus == 1 ? this.getAllStampCombination() : this.toastService.showAlert(
                    response.message,
                    response.apiResponseStatus
                );
            });
    }
}
