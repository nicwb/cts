import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { formatDate } from 'src/utils/dateToString';

@Component({
  selector: 'app-ec-form',
  templateUrl: './ec-form.component.html',
  styleUrls: ['./ec-form.component.scss']
})
export class EcFormComponent implements OnInit {

  @Input() heading = ''
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
