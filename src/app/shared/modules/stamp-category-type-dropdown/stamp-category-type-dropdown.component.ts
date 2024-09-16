import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MasterService } from 'src/app/core/services/master/master.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-stamp-category-type-dropdown',
    templateUrl: './stamp-category-type-dropdown.component.html',
    styleUrls: ['./stamp-category-type-dropdown.component.scss']
})
export class StampCategoryTypeDropdownComponent implements OnInit {

    CategoryTypeList: any[] = [];
    selectedCategoryType:any;
  @Output() CategoryTypeSelected = new EventEmitter<string>();

  constructor(private masterService: MasterService, private toastService: ToastService,) { }
  ngOnInit(): void {
      this.masterService.getCategoryTypes().subscribe((response) => {
          if (response.apiResponseStatus == 1) {
              this.CategoryTypeList = response.result
          } else {
              this.toastService.showError(response.message);
          }
      })
  }

  onStampCategorySelected() {    
      this.CategoryTypeSelected.emit(this.selectedCategoryType.stampCategory1);
  }
}
