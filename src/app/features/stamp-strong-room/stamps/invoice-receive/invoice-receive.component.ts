import { Component, OnInit } from '@angular/core';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { Status } from 'src/app/core/enum/stampIndentStatusEnum';
import { GetStampIndents } from 'src/app/core/models/stamp';
import { StampIndentService } from 'src/app/core/services/stamp/stamp-indent.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { StampInvoiceService } from 'src/app/core/services/stamp/stamp-invoice.service';

@Component({
    selector: 'app-invoice-receive',
    templateUrl: './invoice-receive.component.html',
    styleUrls: ['./invoice-receive.component.scss']
})
export class InvoiceReceiveComponent implements OnInit {

    tableActionButton: ActionButtonConfig<GetStampIndents>[] = [];
    tableData!: DynamicTable<GetStampIndents>;
    tableQueryParameters!: DynamicTableQueryParameters | any;
    constructor(
    private stampIndentService: StampIndentService,
    private stampInvoiceService: StampInvoiceService,
    private toastService: ToastService,) { }

    ngOnInit(): void {
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };

        this.tableActionButton = [
            {
                buttonIdentifier: 'receive',
                class: 'p-button-info p-button-sm',
                icon: 'pi pi-inbox',
                lable: 'Receive',
                renderButton: (rowData) => {
                    return (rowData.status === Status[15] || rowData.status === Status[12]);
                }
            },
            // {
            //   buttonIdentifier: 'rejected',
            //   class: 'p-button-danger p-button-sm',
            //   icon: 'pi pi-times',
            //   lable: 'Rejected',
            //   renderButton: (rowData) => {          
            //     return (rowData.status === Status[13] || rowData.status === Status[16]);
            //   }
            // },
            {
                buttonIdentifier: 'Recieved',
                class: 'p-button-success p-button-sm',
                icon: 'pi pi-check',
                lable: 'Recieved',
                renderButton: (rowData) => {
                    return (rowData.status === Status[14]);
                }
            },
        ];
        this.getAllStampIndents()
    }

    getAllStampIndents() {
        this.stampIndentService
            .getAllStampIndentsProcessed(this.tableQueryParameters)
            .subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    console.log(response);

                    response.result.data.map((item: any) => {
                        item.createdAt = convertDate(item.createdAt);
                        item.memoDate = convertDate(item.memoDate);
                        item.status = Status[item.status]
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
        this.stampIndentService.receiveIndent($event.rowData.stampIndentId).subscribe((response) => {
            if (response.apiResponseStatus == 1) {

                this.toastService.showSuccess(
                    response.message,
                );
                this.getAllStampIndents()
            } else {
                this.toastService.showAlert(
                    response.message,
                    response.apiResponseStatus
                );
            }
        })
    }
}
