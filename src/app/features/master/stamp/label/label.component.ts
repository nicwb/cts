import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { ToastService } from 'src/app/core/services/toast.service';
import { LabelService } from 'src/app/core/services/stamp/label.service';
import { convertDate } from 'src/utils/dateConversion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddStampLabel, GetStampLabels } from 'src/app/core/models/stamp';

@Component({
    selector: 'app-label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

    labelEntryForm!: FormGroup;
    displayInsertModal: boolean | undefined;
    tableActionButton: ActionButtonConfig[] = [];
    tableData!: DynamicTable<GetStampLabels>;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    labelEntryPayload!: AddStampLabel
    constructor(
    private fb: FormBuilder,
    private LabelService: LabelService,
    private toastService: ToastService,
    ) { }

    ngOnInit(): void {

        this.initializeForms()

        this.tableActionButton = [
            // {
            //   buttonIdentifier: 'edit',
            //   class: 'p-button-warning p-button-sm',
            //   icon: 'pi pi-file-edit',
            //   lable: 'Edit',
            // },
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
        this.getAllStampLabels();
    }

    initializeForms() {
        this.labelEntryForm = this.fb.group({
            noLabelPerSheet: [0, Validators.required],
        });
    }

    getAllStampLabels() {
        this.LabelService
            .getStampLabelList(this.tableQueryParameters)
            .subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    response.result.data.map((item: any) => {
                        item.isActive = item.isActive ? "Yes" : "No"
                        item.createdAt = convertDate(item.createdAt)
                    })
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
        this.LabelService.deleteStampLabel($event.rowData.labelId)
            .subscribe((response) => {
                response.apiResponseStatus == 1 ? this.getAllStampLabels() : this.toastService.showAlert(
                    response.message,
                    response.apiResponseStatus
                );

            });
    }

    showInsertDialog() {
        this.displayInsertModal = true
    }
    addLabel() {
        if (this.labelEntryForm.valid) {
            this.labelEntryPayload = {
                noLabelPerSheet: this.labelEntryForm.value.noLabelPerSheet
            };
            console.log(this.labelEntryPayload);

            this.LabelService.addNewStampLabel(this.labelEntryPayload).subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    this.toastService.showAlert('Stamp Label added successfully', 1);
                    this.displayInsertModal = false;
                    this.getAllStampLabels();
                } else {
                    this.toastService.showAlert(response.message, response.apiResponseStatus);
                }
            });
        } else {
            this.toastService.showAlert('Please fill all the required fields', 0);
        }
    }

}
