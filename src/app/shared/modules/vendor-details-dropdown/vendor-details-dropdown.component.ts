import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-vendor-details-dropdown',
  templateUrl: './vendor-details-dropdown.component.html',
  styleUrls: ['./vendor-details-dropdown.component.scss']
})
export class VendorDetailsDropdownComponent implements OnInit {
  VendorDetailsList: any[] = []
  selectedVendorDetail: any
  data: any[] = [];
  @Output() VendorDetailsSelected = new EventEmitter<any>();

  constructor(private toastService: ToastService, private stampMasterService: StampMasterService,
  ) { }


  ngOnInit(): void {
    this.getAllVendors()
  }

  formatResultItem(item: any): any {
    return { vendorDetails: `${item.stampVendorId} | Name: ${item.vendorName} | Type: ${item.vendorType}` }
  }

  getAllVendors() {
    this.stampMasterService
      .getStampVendorDetails()
      .subscribe((response) => {        
        if (response.apiResponseStatus == 1) {
          this.data = response.result;
          response.result.map((item: any) => {
            this.VendorDetailsList.push(this.formatResultItem(item))

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

  onVendorDetailsSelected() {
    const val = this.data.filter((item) => {
      return item.stampVendorId == this.extractFirstNumber(this.selectedVendorDetail.vendorDetails)
    })    
    this.VendorDetailsSelected.emit(val[0]);
  }

  reset() {
    this.selectedVendorDetail = null
  }
}
