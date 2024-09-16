import { Component, OnInit, ViewChild } from '@angular/core';
import { ChequeIndentComponent } from './cheque-indent/cheque-indent.component';
import { ChequeIndentService } from 'src/app/core/services/cheque/cheque-indent.service';
import { ActionButtonConfig, DynamicTable, DynamicTableQueryParameters } from 'src/app/core/models/dynamic-table';
import { ToastService } from 'src/app/core/services/toast.service';
import { tokenDetails } from 'src/app/core/models/token';
import { ChequeIndentList } from 'src/app/core/models/cheque';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgxRolesService, NgxPermissionsService } from 'ngx-permissions';
import { indentStatusEnum, invoiceStatus } from 'src/app/core/enum/ChequeEnum';
import { ChequeInvoiceService } from 'src/app/core/services/cheque/cheque-invoice.service';

@Component({
    selector: 'app-cheque-indent-invoice',
    templateUrl: './cheque-indent-invoice.component.html',
    styleUrls: ['./cheque-indent-invoice.component.scss'],
    providers: [ConfirmationService]
})
export class ChequeIndentInvoiceComponent implements OnInit {

  @ViewChild(ChequeIndentComponent) addIndent!: ChequeIndentComponent;
  tableQueryParameters!: DynamicTableQueryParameters | any;
  tableData!: DynamicTable<ChequeIndentList>;
  tableActionButton: ActionButtonConfig<ChequeIndentList>[] = [];
  listType: string = 'indent';
  displayModal: boolean | undefined;
  constructor(private ngxPermissionsService: NgxPermissionsService, private chequeIndentService: ChequeIndentService, private chequeInvoiceService:ChequeInvoiceService,private toastService: ToastService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
      this.changeListType('indent');
  }

  callChequeIndent() {
      this.addIndent
  }
  /**
   * Handles the button click event and performs the appropriate action based on the button identifier.
   *
   * @param {any} event - The event object containing information about the button click.
   */
  buttonHandler(event: any) {
      switch (event.buttonIdentifier) {
      case 'indent-approve':
          this.approveIndent(event.rowData.id);
          break;
      case 'indent-reject':
          this.rejectIndent(event.rowData.id);
          break;
      case 'indent-edit':
          this.toastService.showSuccess('Edit');
          break;
      case 'indent-forward':
          this.frowardIndentTO(event.rowData.id);
          break;
      case 'invoice-approve':
          this.approvedChequeIndent(event.rowData.id)
          break;
      case 'indent-invoice':
          this.router.navigate(['cheque/cheque-indent-invoice/approved-cheque-indent', event.rowData.id]);
          break;
      case 'invoice-forward':
          this.changeListType('invoice');
          this.frowardInvoiceTO(event.rowData.id);
          break;
      case 'invoice-received':
          this.router.navigate(['cheque/cheque-indent-invoice/cheque-received', event.rowData.id]);
          break;
      }
  }
  approveIndent(indentId: number) {
      this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.chequeIndentService.approveChequeIndent(indentId).subscribe((response) => {
                  if (response.apiResponseStatus == 1) {
                      this.chequeIndentList();
                  }
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              })
          },
      });
  }
  rejectIndent(indentId: number) {
      this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.chequeIndentService.rejectChequeIndent(indentId).subscribe((response) => {
                  if (response.apiResponseStatus == 1) {
                      this.chequeIndentList();
                  }
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              })
          },
      });
  }
  frowardIndentTO(indentId: number) {
      this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.chequeIndentService.frowardChequeIndent(indentId).subscribe((response) => {
                  if (response.apiResponseStatus == 1) {
                      this.chequeIndentList();
                  }
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              })
          },
      });
  }
  frowardInvoiceTO(invoiced: number) {
      this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.chequeInvoiceService.frowardChequeInvoice(invoiced).subscribe((response) => {
                  if (response.apiResponseStatus == 1) {
                      this.chequeInvoiceList();
                  }
                  this.toastService.showAlert(response.message, response.apiResponseStatus);
              })
          },
      });
  }
  /**
   * Change the list type and update the table action buttons and query parameters accordingly.
   *
   * @param {string} type - The new list type.
   */
  changeListType(type: string) {
      this.listType = type;
      if (type == 'indent') {
          this.tableActionButton = [
              {
                  buttonIdentifier: 'indent-forward',
                  class: ' p-button-sm',
                  icon: 'pi pi-check',
                  lable: 'Froward TO',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == indentStatusEnum.NewIndent && this.ngxPermissionsService.getPermission('can-create-cheque-indent') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'indent-approve',
                  class: 'p-button-success p-button-sm',
                  icon: 'pi pi-check',
                  lable: 'Approve',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == indentStatusEnum.FrowardToTreasuryOfficer && this.ngxPermissionsService.getPermission('can-approve-reject-cheque-indent') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'indent-reject',
                  class: 'p-button-danger p-button-sm',
                  icon: 'pi pi-times',
                  lable: 'Reject',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == indentStatusEnum.FrowardToTreasuryOfficer && this.ngxPermissionsService.getPermission('can-approve-reject-cheque-indent') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'indent-invoice',
                  class: 'p-button-sm',
                  icon: 'pi pi-plus',
                  lable: 'Invoice',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == indentStatusEnum.ApproveByTreasuryOfficer && this.ngxPermissionsService.getPermission('can-create-indent-invoice') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'indent-edit',
                  class: 'p-button-warning p-button-sm',
                  icon: 'pi pi-file-edit',
                  lable: 'Edit',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == indentStatusEnum.NewIndent && this.ngxPermissionsService.getPermission('can-create-cheque-indent') !== undefined;
                  }
              },
          ];
          this.tableQueryParameters = {
              pageSize: 10,
              pageIndex: 0,
          };
          this.chequeIndentList();
      }
      if (type == 'invoice') {
          this.tableActionButton = [
        
              {
                  buttonIdentifier: 'invoice-received',
                  class: ' p-button-sm',
                  icon: 'pi pi-users',
                  lable: 'Receive',
                  renderButton: (rowData) => {
                      //TODO:: Change this permission to "can-distribute-cheque-invoice" if not exiest then create permission in UM
                      return rowData.currentStatusId == invoiceStatus.FrowardToTreasuryOfficer && this.ngxPermissionsService.getPermission('can-approve-reject-cheque-indent') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'invoice-forward',
                  class: ' p-button-sm',
                  icon: 'pi pi-check',
                  lable: 'Froward TO',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == invoiceStatus.NewInvoice && this.ngxPermissionsService.getPermission('can-create-indent-invoice') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'invoice-edit',
                  class: 'p-button-warning p-button-sm',
                  icon: 'pi pi-file-edit',
                  lable: 'Edit',
                  renderButton: (rowData) => {
                      return rowData.currentStatusId == invoiceStatus.NewInvoice && this.ngxPermissionsService.getPermission('can-create-indent-invoice') !== undefined;
                  }
              },
              {
                  buttonIdentifier: 'invoice-details',
                  class: 'p-button-info p-button-sm',
                  icon: 'pi pi-info-circle',
                  lable: 'Details',
              },
          ];
          this.tableQueryParameters = {
              pageSize: 10,
              pageIndex: 0,
          };
          this.chequeInvoiceList();
      }

  }
  chequeInvoiceList() {
      this.chequeIndentService.getChqueInvoiceList(this.tableQueryParameters).subscribe((responce) => {
          if (responce.apiResponseStatus == 1) {
              this.tableData = responce.result;
              console.log(responce.result);
              return;
          }
          this.toastService.showError(responce.message);
      });
  }
  chequeIndentList() {
      this.chequeIndentService.getChqueIndentList(this.tableQueryParameters).subscribe((responce) => {
          if (responce.apiResponseStatus == 1) {
              this.tableData = responce.result;
        
              return;
          }
          this.toastService.showError(responce.message);
      });
  }
  approvedChequeIndent(id: number) {
      this.router.navigate(['/cheque/approved-cheque-indent', id]);
  }

  showModal() {
      this.displayModal = true;
  }

}
