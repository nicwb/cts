import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs/internal/Subscription';
import { StatusType } from 'src/app/core/enum/common';
import {
    DynamicTable,
    DynamicTableQueryParameters,
    ActionButtonConfig,
} from 'src/app/core/models/dynamic-table';
import { tokenDetails } from 'src/app/core/models/token';
import { TokenService } from 'src/app/core/services/Token/token.service';

@Component({
    selector: 'app-bill-checking',
    templateUrl: './bill-checking.component.html',
    styleUrls: ['./bill-checking.component.scss'],
})
export class BillCheckingComponent implements OnInit, OnDestroy {
    StatusType = StatusType;
    routeItems: MenuItem[] = [];
    tableActionButton: ActionButtonConfig[] = [];
    tableData:DynamicTable<tokenDetails>|any;
    tableQueryParameters:DynamicTableQueryParameters|any;
    private subscribtion: Subscription | any;
    constructor(private tokenServices: TokenService, private router: Router) {}

    ngOnInit(): void {
        this.subscribtion = this.tokenServices
            .getActionButtonObservable()
            .subscribe((data) => {
                // this.setToBillCheck();
            });
        this.tableActionButton = [
            {
                buttonIdentifier: 'bill_checking',
                class: '"p-button-raised p-button-rounded',
                icon: 'pi pi-check-circle',
                lable: 'Bill Checking',
              },
        ];
        this.routeItems = [
            { label: 'Bill Details', routerLink: 'personal' },
            { label: 'List Of Objection', routerLink: 'role' },
            // { label: 'BY Transfer', routerLink: 'confirmation' },
            // { label: 'PL Transfer', routerLink: 'confirmation' },
        ];
        this.tableQueryParameters = {
            pageSize: 10,
            pageIndex: 0,
        };
        this.getTableData();
    }
    ngOnDestroy() {
        this.subscribtion.unsubscribe();
    }
    closeButton(event: any) {
        console.log('functional', event);
        this.router.navigate(['/']);
    }
    handleRowSelection(event:any){
      console.log(event);
    }
    handleButtonClick(event: any) {
        console.log(event);
        
        if(event.buttonIdentifier=='bill_checking'){
            this.tokenServices.selectedId = event.rowData.tokenId;
            this.tokenServices.selectedTokenRef = event.rowData.referenceNo;
            this.router.navigate(['/bill-checking/new-bill-check/bill-details']);
        }
    }
    handQueryParameterChange(event: any) {
        this.tableQueryParameters =event;
        this.getTableData();
    }
    getTableData(){
        this.tokenServices.getTokens('Token/GetTokens?listType=bill-cheking',this.tableQueryParameters).subscribe((response)=>{
            if(response.apiResponseStatus==1){
                this.tableData = response.result;
            }
        });
    }

    handleSearchKeyChange(searchKey: string) {
        console.log('Received search key:', searchKey);
    }
}
