import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-da-arrear-pension-approval',
    templateUrl: './da-arrear-pension-approval.component.html',
    styleUrls: ['./da-arrear-pension-approval.component.scss'],
    standalone: true,
    imports: [
        DividerModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
    ],
})
export class DaArrearPensionApprovalComponent implements OnInit {
    DaArrearPensionApprovalForm: FormGroup = new FormGroup({});

    months: SelectItem[] = [];
    month: string = '';
    years: any[] = [];
    selectedYear: any;
    date: Date | undefined;
    searched = false;

    constructor() {}

    ngOnInit(): void {
        this.date = new Date();
        for (
            let i = this.date.getFullYear();
            i >= this.date.getFullYear() - 10;
            --i
        ) {
            this.years.push({ label: `${i}`, value: `${i}` });
        }
        this.selectedYear = this.years[0];
        this.months = [
            {
                label: 'January',
                value: { id: 1, name: 'January', code: 'Jan' },
            },
            {
                label: 'February',
                value: { id: 2, name: 'February', code: 'Feb' },
            },
            { label: 'March', value: { id: 3, name: 'March', code: 'March' } },
            { label: 'April', value: { id: 4, name: 'April', code: 'April' } },
            { label: 'May', value: { id: 5, name: 'May', code: 'May' } },
            { label: 'June', value: { id: 6, name: 'June', code: 'June' } },
            { label: 'July', value: { id: 7, name: 'July', code: 'July' } },
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
    }
    search() {
        console.log('searching');
        this.searched = true;
    }
}
