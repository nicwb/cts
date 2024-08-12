import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { convertDate } from 'src/utils/dateConversion';
import { AddStampVendors, GetStampVendors } from 'src/app/core/models/stamp';
import { DynamicTable, DynamicTableQueryParameters } from 'mh-prime-dynamic-table';
import { formatDate } from 'src/utils/dateToString';
import { StampMasterService } from 'src/app/core/services/stamp/stamp-master.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  vendorType!: string;
  vendorTreasury!: string;
  VendorDetailsEntryForm!: FormGroup;
  displayInsertModal: boolean | undefined;
  tableActionButton: any[] = [];
  tableData!: DynamicTable<GetStampVendors>;
  tableQueryParameters!: DynamicTableQueryParameters | any;;
  vendorEntryPayload!: AddStampVendors;
  vendorPhotoFile!: File;
  vendorPanPhotoFile!: File;
  vendorLicencePhotoFile!: File;
  isLoading: boolean = false

  constructor(
    private fb: FormBuilder,
    private stampMasterService:StampMasterService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.tableActionButton = [
      {
        buttonIdentifier: 'delete',
        class: 'p-button-danger p-button-sm',
        icon: 'pi pi-trash',
        lable: 'Delete',
      },
    ];

    this.tableQueryParameters = {
      pageSize: 10,
      pageIndex: 0,
    };

    this.getAllStampVendors();
  }

  initializeForms() {
    this.VendorDetailsEntryForm = this.fb.group({
      vendorPhoto: [null, Validators.required],
      vendorName: ['', Validators.required],
      panNumber: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      licenseNo: ['', Validators.required],
      vendorPanPhoto: [null, Validators.required],
      vendorLicencePhoto: [null, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      address: ['', Validators.required],
      effectiveFrom: ['', Validators.required],
      validUpto: ['', Validators.required],
    });
  }

  getAllStampVendors() {
    this.isLoading = true;
    this.stampMasterService.getStampVendorList(this.tableQueryParameters).subscribe((response) => {
      if (response.apiResponseStatus == 1) {
        response.result.data.map((item: any) => {
          item.isActive = item.isActive ? "Yes" : "No";
          item.activeAtGrips = item.activeAtGrips ? "Yes" : "No";
          item.createdAt = convertDate(item.createdAt);
          item.vendorLicencePhoto = `<a href=${item.vendorLicencePhoto} style="text-decoration:none">Click</a>`
          item.vendorPanPhoto = `<a href=${item.vendorPanPhoto} style="text-decoration:none">Click</a>`
          item.vendorPhoto = `<a href=${item.vendorPhoto} style="text-decoration:none">Click</a>`
        });
        this.tableData = response.result;
      } else {
        this.toastService.showAlert(response.message, response.apiResponseStatus);
      }
    });
    this.isLoading = false;
  }

  handleButtonClick($event: any) {
    this.stampMasterService.deleteStampVendor($event.rowData.stampVendorId).subscribe((response) => {
      response.apiResponseStatus == 1 ? this.getAllStampVendors() : this.toastService.showAlert(response.message, response.apiResponseStatus);
    });
  }

  showInsertDialog() {
    this.displayInsertModal = true;
  }

  onVendorTypeSelected($event: any) {
    console.log($event.stampVendorId);
    
    this.vendorType = $event.stampVendorId;
  }
  onTreasurySelected($event: any) {
    this.vendorTreasury = $event
  }
  handleFileInput(event: any, controlName: string) {
    const file = event.target.files[0];
    if (controlName === 'vendorPhoto') {
      this.vendorPhotoFile = file;
    } else if (controlName === 'vendorPanPhoto') {
      this.vendorPanPhotoFile = file;
    } else if (controlName === 'vendorLicencePhoto') {
      this.vendorLicencePhotoFile = file;
    }
  }

  addVendors() {
    if (this.VendorDetailsEntryForm.valid) {
      const formData = new FormData();
      formData.append('vendorType', this.vendorType);
      // formData.append('treasury', this.vendorTreasury);
      formData.append('vendorName', this.VendorDetailsEntryForm.value.vendorName);
      formData.append('panNumber', this.VendorDetailsEntryForm.value.panNumber);
      formData.append('licenseNo', this.VendorDetailsEntryForm.value.licenseNo);
      formData.append('address', this.VendorDetailsEntryForm.value.address);
      formData.append('phoneNumber', this.VendorDetailsEntryForm.value.phoneNumber);
      formData.append('effectiveFrom', formatDate(this.VendorDetailsEntryForm.value.effectiveFrom));
      formData.append('validUpto', formatDate(this.VendorDetailsEntryForm.value.validUpto) );
      formData.append('vendorPhoto', this.vendorPhotoFile);
      formData.append('vendorPanPhoto', this.vendorPanPhotoFile);
      formData.append('vendorLicencePhoto', this.vendorLicencePhotoFile);
      
      this.stampMasterService.addNewStampVendor(formData).subscribe((response) => {
        if (response.apiResponseStatus == 1) {
          this.toastService.showAlert('Vendor details added successfully', 1);
          this.displayInsertModal = false;
          this.getAllStampVendors();
        } else {
          console.log(response.result);
          this.toastService.showAlert(response.message, response.apiResponseStatus);
        }
      });
    } else {
      this.toastService.showWarning('Please fill all the required fields');
    }
  }
}
