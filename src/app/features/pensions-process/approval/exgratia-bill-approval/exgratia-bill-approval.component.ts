import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-exgratia-bill-approval',
    templateUrl: './exgratia-bill-approval.component.html',
    styleUrls: ['./exgratia-bill-approval.component.scss'],
})
export class ExgratiaBillApprovalComponent implements OnInit {
    ExgratiaBillApprovalForm?: FormGroup;

    constructor(private fb: FormBuilder) {}

    initializeForm() {
        this.ExgratiaBillApprovalForm = this.fb.group({
            month: [''],
            year: [''],
        });
    }
    ngOnInit(): void {
        this.initializeForm();
    }
}
