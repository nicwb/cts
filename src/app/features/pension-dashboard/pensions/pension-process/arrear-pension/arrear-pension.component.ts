import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Product } from 'src/app/demo/api/product';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-arrear-pension',
  templateUrl: './arrear-pension.component.html',
  styleUrls: ['./arrear-pension.component.scss']
})
export class ArrearPensionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
