import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalComponent } from './approval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MhPrimeDynamicTableModule } from 'mh-prime-dynamic-table';
import { DynamicTableModule } from 'src/app/shared/modules/dynamic-table/dynamic-table.module';
import { DropdownModule } from 'primeng/dropdown';
import { TreasuryDropdownModule } from 'src/app/shared/modules/treasury-dropdown/treasury-dropdown.module';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { DividerModule } from 'primeng/divider';
import { SharedModule } from 'primeng/api';
import { FirstpensionbillapprovalModule } from './firstpensionbillapproval/firstpensionbillapproval.module';
import { PpoApprovalModule } from './ppo-approval/ppo-approval.module';
import { FirstpensionbillapprovalComponent } from './firstpensionbillapproval/firstpensionbillapproval.component';
import { PpoApprovalComponent } from './ppo-approval/ppo-approval.component';

// Routes for lazy loading the modules
const routes: Routes = [
    { path: '', component: ApprovalComponent, data: { breadcrumb: 'ApprovalComponent' } },
    {
        path: 'ppo-approval',
        component: PpoApprovalComponent,
        data: { breadcrumb: 'PpoApprovalComponent' }
    },
    {
        path: 'firstpensionbill-approval',
        component: FirstpensionbillapprovalComponent,
        data: { breadcrumb: 'FirstpensionbillapprovalComponent' }
    },
    {
        path: 'ppo-approval/:ppoId',
        component: PpoApprovalComponent
    },
];

@NgModule({
    declarations: [ApprovalComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextareaModule,
        CommonHeaderModule,
        DialogModule,
        CalendarModule,
        InputTextModule,
        CardModule,
        SelectButtonModule,
        PanelModule,
        FieldsetModule,
        RadioButtonModule,
        TableModule,
        MhPrimeDynamicTableModule,
        DynamicTableModule,
        DropdownModule,
        TreasuryDropdownModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        ProgressBarModule,
        ToastModule,
        SliderModule,
        RatingModule,
        PopupTableModule,
        DividerModule,
        SharedModule,
        OptionCardModule,
        // PpoApprovalModule,
        // FirstpensionbillapprovalModule,
        RouterModule.forChild(routes) // Lazy loading routes
    ],
    exports: [ApprovalComponent]
})
export class ApprovalModule { }
