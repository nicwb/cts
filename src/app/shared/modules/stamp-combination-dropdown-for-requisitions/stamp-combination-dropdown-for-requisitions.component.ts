import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-stamp-combination-dropdown-for-requisitions',
  templateUrl: './stamp-combination-dropdown-for-requisitions.component.html',
  styleUrls: ['./stamp-combination-dropdown-for-requisitions.component.scss']
})
export class StampCombinationDropdownForRequisitionsComponent implements OnInit {

  CombinationTypeList: any[] = [];
  clonedCombinationTypeList: any[] = [];
  selectedCombinationType: any;
  data: any[] = [];

  @Output() StampCombinationSelected = new EventEmitter<any>();

  constructor(private toastService: ToastService, private stampMasterService: StampMasterService) { }
  ngOnInit(): void {
    this.getAllStampCombination()
  }

  formatResultItem(item: any): any {
    return { combination: `${item.stampCombinationId} | Category: ${item.stampCategory1} | Denomination: ${item.denomination}` };
  }

  getAllStampCombination() {
    this.stampMasterService
      .getAllStampCombinations()
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.data = response.result;
          this.CombinationTypeList = response.result.map(this.formatResultItem);
          this.clonedCombinationTypeList = [...this.CombinationTypeList];
        } else {
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
  }

  extractFirstNumber(input: string): number | null {
    const match = input.match(/^\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  onStampCombinationSelected() {
    if (this.selectedCombinationType) {
      const selectedStamp = this.data.find((item) =>
        item.stampCombinationId == this.extractFirstNumber(this.selectedCombinationType.combination)
      );
      this.StampCombinationSelected.emit(selectedStamp);
    }
  }

  reset() {
    this.selectedCombinationType = null;
  }

  removeCategory(category: string, denomination: number) {
      if (category && denomination) {
        this.CombinationTypeList = this.CombinationTypeList.filter((item) => !item.combination.includes(`Category: ${category} | Denomination: ${denomination}`) && item.combination.includes(category))
      }
  }

  reAssign() {
    this.CombinationTypeList = [...this.clonedCombinationTypeList];
  }

}
