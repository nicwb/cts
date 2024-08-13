import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master/master.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-treasury-dropdown',
  templateUrl: './treasury-dropdown.component.html',
  styleUrls: ['./treasury-dropdown.component.scss']
})
export class TreasuryDropdownComponent implements OnInit {

  treasuryList: any[] = [];
  selectedTreasuryCode: any;
  @Output() treasurySelected = new EventEmitter<string>();

  constructor(private masterService: MasterService, private toastService: ToastService,) { }
  ngOnInit(): void {
    this.masterService.getTreasuries().subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        this.treasuryList = response.result
        this.selectedTreasuryCode = {name: 'KOLKATA COLLECTORATE', code: 'CAA'}
      } else {
        this.toastService.showError(response.message);
      }
    })
  }

  onTreasurySelected() {    
    this.treasurySelected.emit(this.selectedTreasuryCode.code);
  }

}
