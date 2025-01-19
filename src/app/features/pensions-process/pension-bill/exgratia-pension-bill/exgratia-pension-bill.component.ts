import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PopupTableModule } from 'src/app/core/popup-table/popup-table.module';
import { CommonHeaderModule } from 'src/app/shared/modules/common-header/common-header.module';
import { OptionCardModule } from 'src/app/shared/modules/option-card/option-card.module';

@Component({
    selector: 'app-exgratia-pension-bill',
    templateUrl: './exgratia-pension-bill.component.html',
    styleUrls: ['./exgratia-pension-bill.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        AutoCompleteModule,
        CalendarModule,
        CascadeSelectModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        ColorPickerModule,
        DialogModule,
        DynamicDialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        InputMaskModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        ListboxModule,
        MultiSelectModule,
        PanelModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        SelectButtonModule,
        SliderModule,
        SplitButtonModule,
        TableModule,
        ToastModule,
        ToggleButtonModule,
        CommonHeaderModule,
        OptionCardModule,
        PopupTableModule,
    ],
})
export class ExgratiaPensionBillComponent implements OnInit {
    ExgratiaBillGenerationtForm?: FormGroup;
    months: SelectItem[] = [];
    selectedBranchIds: number[] | null = null;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.months = [
            {
                label: 'January',
                value: { id: 1, name: 'January', code: 'Jan' },
            },
            {
                label: 'February',
                value: { id: 2, name: 'February', code: 'Feb' },
            },
            { label: 'March', value: { id: 3, name: 'March', code: 'Mar' } },
            { label: 'April', value: { id: 4, name: 'April', code: 'Apr' } },
            { label: 'May', value: { id: 5, name: 'May', code: 'May' } },
            { label: 'June', value: { id: 6, name: 'June', code: 'Jun' } },
            { label: 'July', value: { id: 7, name: 'July', code: 'Jul' } },
            { label: 'August', value: { id: 8, name: 'August', code: 'Aug' } },
            {
                label: 'September',
                value: { id: 9, name: 'September', code: 'Sep' },
            },
            {
                label: 'October',
                value: { id: 10, name: 'October', code: 'Oct' },
            },
            {
                label: 'November',
                value: { id: 11, name: 'November', code: 'Nov' },
            },
            {
                label: 'December',
                value: { id: 12, name: 'December', code: 'Dec' },
            },
        ];

        this.ExgratiaBillGenerationtForm = this.fb.group({
            choices: ['', Validators.required],
            months: ['', Validators.required],
            year: [new Date(), Validators.required],
            bank: [''],
            category: [''],
            selectedBranches: [[], Validators.required],
            religion: ['', Validators.required],
        });
    }

    onRefresh(): void {
        if (this.ExgratiaBillGenerationtForm != undefined) {
            this.ExgratiaBillGenerationtForm.reset();
        }
    }

    onBranchSelectChange(event: { value: number[] }): void {
        this.selectedBranchIds = event.value; // Update selected branch IDs
    }

    onYearSelect($event: any): void {
        console.log('onYearSelect');
    }

    onChangeBank($event: any): void {
        console.log('onChangeBank');
    }

    onBranchChoiceChange() {
        console.log('OnBrachChange101');
    }
    onChangeBankForBranches($event: any): void {
        console.log('OnChangeBankForBranches');
    }
    shouldShowCategoryInputControl(): boolean {
        if (this.ExgratiaBillGenerationtForm != undefined) {
            const choices = this.ExgratiaBillGenerationtForm.get('choices');
            if (!choices) {
                return false;
            }
            const selectedChoice = choices.value;
            return (
                selectedChoice === 'allBankSpecificCategory' ||
                selectedChoice === 'specificBankSpecificCategory'
            );
        }
        return false;
    }
    shouldShowBankInputControl(): boolean {
        if (this.ExgratiaBillGenerationtForm != undefined) {
            const choices = this.ExgratiaBillGenerationtForm.get('choices');
            if (!choices) {
                return false;
            }
            const selectedChoice = choices.value;
            return (
                selectedChoice === 'specificBackAllCategory' ||
                selectedChoice === 'specificBankSpecificCategory'
            );
        }
        return false;
    }
    shouldShowBankForBranchesControl(): boolean {
        if (!this.ExgratiaBillGenerationtForm) {
            return false;
        }
        const choices = this.ExgratiaBillGenerationtForm.get('choices');
        if (!choices) {
            return false;
        }
        const selectedChoice = choices.value;
        return selectedChoice === 'specificBranchOrBranches';
    }
    // shouldShowCategoryInputControl(): boolean {
    //   if (!this.ExgratiaBillGenerationtForm) {
    //     return false;
    //   }

    //   const choices = this.ExgratiaBillGenerationtForm.get('choices');
    //   if (!choices) {
    //     return false;
    //   }
    //   const selectedChoice = choices.value;
    //   return (
    //     selectedChoice === 'allBankSpecificCategory' ||
    //     selectedChoice === 'specificBankSpecificCategory'
    //   );

    // }
}
