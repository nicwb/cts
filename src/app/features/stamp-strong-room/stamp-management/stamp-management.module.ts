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


@NgModule({
  declarations: [StampManagementComponent, StampRequisitionComponent, NewStampRequisitionComponent, StampRequisitionStagingComponent, StampRequisitionApprovalComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    DynamicTableModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    OptionCardModule,
    CommonHeaderModule,
    StampManagementRoutingModule,
    TreasuryDropdownModule,
    StampCombinationDropdownModule,
    VendorDetailsDropdownModule
  ]
})
export class StampManagementModule { }
