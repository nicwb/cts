import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StampCombinationService } from 'src/app/core/services/stamp/stamp-combination.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-stamp-combination-dropdown',
  templateUrl: './stamp-combination-dropdown.component.html',
  styleUrls: ['./stamp-combination-dropdown.component.scss']
})
export class StampCombinationDropdownComponent implements OnInit {

  CombinationTypeList: any[] = [];
  selectedCombinationType: any;
  data: any[] = [];
  @Output() StampCombinationSelected = new EventEmitter<any>();

  constructor(private toastService: ToastService, private stampCombinationService: StampCombinationService) { }
  ngOnInit(): void {
    this.getAllStampCombination()
  }

  formatResultItem(item: any): any {
    // return { combination: `${item.stampCombinationId}-${item.stampCategory1}-${item.description}-${item.denomination}-${item.noLabelPerSheet}` };
    return { combination: `${item.stampCombinationId} | Category: ${item.stampCategory1} | Description: ${item.description} | Denomination: ${item.denomination} | No of Labels per Sheet: ${item.noLabelPerSheet}` }
  }
  getAllStampCombination() {
    this.stampCombinationService
      .getAllStampCombinations()
      .subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.data = response.result;
          response.result.map((item: any) => {
            this.CombinationTypeList.push(this.formatResultItem(item))
          });
        } else {
          this.toastService.showAlert(
            response.message,
            response.apiResponseStatus
          );
        }
      });
  }

  extractFirstNumber(input: string): number | null {
    const match = input.match(/^\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  onStampCombinationSelected() {
    const val = this.data.filter((item) => {
      if (this.selectedCombinationType) {
        return item.stampCombinationId == this.extractFirstNumber(this.selectedCombinationType.combination)
      }
      return []
    })
    // console.log(val[0]);
    
    this.StampCombinationSelected.emit(val[0]);
  }
  reset() {
    this.selectedCombinationType = null
  }
}
