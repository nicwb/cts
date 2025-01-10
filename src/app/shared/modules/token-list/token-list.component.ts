import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStatus } from 'src/app/core/enum/common';
import { IBillDetails } from 'src/app/core/models/bill';
import {
    DynamicTable,
    DynamicTableQueryParameters,
    FilterParameter,
    SortParameter,
} from 'src/app/core/models/dynamic-table';
import { tokenDetails } from 'src/app/core/models/token';
import { BillService } from 'src/app/core/services/Bill/bill.service';
import { TokenService } from 'src/app/core/services/Token/token.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-token-list',
    templateUrl: './token-list.component.html',
    styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent implements OnInit {
    @Input() actionRoute: string | any;
    @Input() actionButtonClass: string = '';
    @Input() listType: string = '';
    @Input() isAllToken: number = 0;
    @Input() apiPath: string | any;
    @Input() actionLable: string | any;
    @Input() actionIcon: string | any;
    tokens: tokenDetails[][] | any;
    listData: DynamicTable<tokenDetails> | any;
    loading: boolean = false;
    filterParams: FilterParameter[] = [];
    sortParams: SortParameter | any;
    refreshTable: boolean = false;
    sortOrder: number | any;
    pageSize: number = 10;
    pageIndex: number = 0;
    sortField: string | any;

    constructor(
        private tokenServices: TokenService,
        private toastService: ToastService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.isAllToken != 0) {
            this.allTokenList();
        } else {
            this.tokensList(this.listType);
        }
    }
    //=============================
    action(selectedToken: tokenDetails) {
        this.setTokenDetils(selectedToken);
        this.tokenServices.actionButtonClicked();
    }
    //=============================
    allTokenList() {
        this.tokenServices.getAllToken().subscribe((response) => {
            if (response.apiResponseStatus == 1) {
                this.tokens = response.result;
            } else {
                this.toastService.showAlert(
                    response.message,
                    response.apiResponseStatus
                );
            }
        });
    }
    tokensList(listType: string) {
        const queryParameters: DynamicTableQueryParameters = {
            // listType: listType,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            filterParameters: this.filterParams,
            sortParameters: this.sortParams,
        };
        this.tokenServices
            .getTokens(this.apiPath, queryParameters)
            .subscribe((response) => {
                if (response.apiResponseStatus == 1) {
                    this.listData = response.result;
                    // this.tokens = response.result;
                } else {
                    this.toastService.showAlert(
                        response.message,
                        response.apiResponseStatus
                    );
                }
            });
    }
    setTokenDetils(selectedToken: tokenDetails) {
        this.tokenServices.selectedId = selectedToken.tokenId;
        this.tokenServices.selectedTokenNo = selectedToken.tokenNumberr;
        this.tokenServices.selectedTokenDate = selectedToken.tokenDate;
        this.tokenServices.selectedTokenRef = selectedToken.referenceNo;
    }
    // tokenFeatures(tokenId:number,tokenNo:Number, tokenDate:Date,tokenRef:number){
    //   this.tokenServices.selectedId= tokenId;
    //   this.tokenServices.selectedTokenNo= tokenNo;
    //   this.tokenServices.selectedTokenDate = tokenDate;
    //   this.tokenServices.selectedTokenRef = tokenRef;
    //   this.router.navigate([this.actionRoute]);
    // }
}
