import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StampManagementRoutingModule } from './stamp-management-routing.module';
import { StampManagementComponent } from './stamp-management.component';
import { StampRequisitionComponent } from './stamp-requisition/stamp-requisition.component';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { NewStampRequisitionComponent } from './new-stamp-requisition/new-stamp-requisition.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { StampCombinationDropdownModule } from 'src/app/shared/modules/stamp-combination-dropdown/stamp-combination-dropdown.module';
import { VendorDetailsDropdownModule } from 'src/app/shared/modules/vendor-details-dropdown/vendor-details-dropdown.module';
import { StampRequisitionStagingComponent } from './stamp-requisition-staging/stamp-requisition-staging.component';
import { StampRequisitionApprovalComponent } from './stamp-requisition-approval/stamp-requisition-approval.component';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentProcessingComponent } from './payment-processing/payment-processing.component';
import { DialogModule } from 'primeng/dialog';
import { Tr7FormModule } from 'src/app/shared/modules/tr7-form/tr7-form.module';
import { StampDeliveryComponent } from './stamp-delivery/stamp-delivery.component';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [StampManagementComponent, StampRequisitionComponent, NewStampRequisitionComponent, StampRequisitionStagingComponent, StampRequisitionApprovalComponent, PaymentProcessingComponent, StampDeliveryComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    DynamicTableModule,
    FormsModule,
    DialogModule,
    TableModule,
    ReactiveFormsModule,
    CheckboxModule,
    OptionCardModule,
    CommonHeaderModule,
    StampManagementRoutingModule,
    TreasuryDropdownModule,
    StampCombinationDropdownModule,
    VendorDetailsDropdownModule,
    MhPrimeDynamicTableModule,
    Tr7FormModule
  ]
})
export class StampManagementModule { }
