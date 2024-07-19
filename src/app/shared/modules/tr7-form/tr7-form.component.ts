import { Component, Input, OnInit } from '@angular/core';
import { StampRequisitionService } from 'src/app/core/services/stamp/stamp-requisition.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { numberToWords } from 'src/utils/numberToWords';

@Component({
  selector: 'app-tr7-form',
  templateUrl: './tr7-form.component.html',
  styleUrls: ['./tr7-form.component.scss']
})
export class Tr7FormComponent implements OnInit {
  @Input() data: any;
  raisedToTreasury?: string;
  treasuryName?: string;
  hoa?: string;
  detailHead?: string;
  amount?: string;
  amountInWord?: string;
  vendorName?: string;
  vendorAddress?: string;

  constructor(private stampRequisitionService: StampRequisitionService, private toastService: ToastService) { }

  ngOnInit(): void {
    if (this.data) {
      this.raisedToTreasury = this.data.raisedToTreasury;
      this.hoa = this.data.hoa;
      this.detailHead = this.data.detailHead;
      this.amount = this.data.amount;
      this.amountInWord = numberToWords(Number(this.amount));
      this.vendorName = this.data.vendorName;
      this.vendorAddress = this.data.vendorAddress;
      this.treasuryName = this.data.treasuryName;
    }
  }

  printTR7() {
    // window.print()
  }
}
