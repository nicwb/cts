import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDate } from 'src/utils/dateToString';

@Component({
  selector: 'app-from-to-date',
  templateUrl: './from-to-date.component.html',
  styleUrls: ['./from-to-date.component.scss']
})
export class FromToDateComponent implements OnInit {

  @Input() heading = ''
  @Input() buttonLabel = ''
  @Output() newItemEvent = new EventEmitter<any>();
  commonForm: FormGroup = new FormGroup({})
  maxDateLimit: Date = new Date()
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.initiaiozeForm();
  }
  initiaiozeForm() {
    this.commonForm = this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  generate() {
    if (this.commonForm.valid) {
      const payload = {
        fromDate: formatDate(this.commonForm.value.fromDate),
        toDate: formatDate(this.commonForm.value.toDate)
      }
      this.newItemEvent.emit(payload)
    } else {
      this.toastService.showWarning("Please fill all the fileds")
    }
  }
}
