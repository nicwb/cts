export interface GetStampTypes {
  denomination: number;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: number;
}

export interface AddStampType {
  denomination: number;
  isActive?: boolean;
}

export interface GetStampLabels {
  noLabelPerSheet: number;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: number;
}

export interface AddStampLabel {
  noLabelPerSheet: number;
  isActive?: boolean;
}

export interface GetStampCategories {
  stampCategory1: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: number;
}

export interface AddStampCategory {
  stampCategory1: string;
  description: string;
  isActive?: boolean;
}

export interface StampVendorDetails {
  stampVendorId: number;
  vendorType: string;
  licenseNo: string;
  phoneNumber: number;
  panNumber: string;
}

export interface GetStampVendors {
  stampVendorId?: number;
  vendorType: number;
  licenseNo: string;
  address: string;
  phoneNumber: number;
  effectiveFrom: string;
  validUpto: string;
  panNumber: string;
  isActive?: boolean;
  activeAtGrips?: boolean;
  createdAt?: string;
  createdBy?: number;
}

export interface AddStampVendors {
  vendorType: number;
  vendorName: string;
  licenseNo: string;
  address: string;
  phoneNumber: number;
  effectiveFrom: string;
  validUpto: string;
  panNumber: string;
  vendorPhoto: File;
  vendorPanPhoto: File;
  vendorLicencePhoto: File;
}

export interface GetStampDiscountDetails {
  discountId?: number;
  denominationFrom: number;
  denominationTo: number;
  discount: number;
  vendorType: string;
  stampCategory: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: number;
}
export interface AddStampDiscountDetails {
  denominationFrom: number;
  denominationTo: number;
  discount: number;
  vendorType: number;
  StampCategoryId: number;
}

export interface GetStampCombinations {
  stampCombinationId: number,
  stampCategory1: string,
  description: string,
  denomination: number,
  stampDenominationId: number,
  noLabelPerSheet: number,
  stampLabelId: number,
  isActive: true,
  createdAt?: string;
  createdBy?: number;
}

// ===================Indent & Invoice=================


export interface GetStampIndents {
  id: number;
  memoNumber: string;
  memoDate: Date;
  remarks: string;
  raisedToTreasuryCode: string;
  raisedByTreasuryCode: string;
  createdAt: string;
  status: string;
  childData: ChildData[];
}

export interface ChildData {
  id: number;
  combinationId: number;
  stampCategory: string;
  description: string;
  denomination: number;
  labelPerSheet: number;
  sheet: number;
  label: number;
  quantity: number;
  amount: number;
  isInvoiced: boolean;
}

export interface IndentItems {
  stampCombinationId: number;
  sheet: number;
  label: number;
  quantity: number; 
  amount: number; 
}

export interface AddStampIndent {
  memoNumber: string;
  memoDate: string;
  remarks: string;
  raisedToTreasuryCode: string
  stampIndentData: IndentItems[]
}

export interface Indent {
  id: number;
  amount: number;
  availableLabel: number;
  availableSheet: number;
  combinationId: number;
  denomination: number;
  description: string;
  isInvoiced: boolean;
  label: number;
  labelPerSheet: number;
  quantity: number;
  sheet: number;
  stampCategory: string;
}

export interface GetStampInvoices {
  stampIndentId: number;
  memoNumber: string;
  memoDate: string;
  remarks: string;
  raisedToTreasuryCode: string;
  stmapCategory: string;
  description: string;
  denomination: number;
  sheet: number;
  label: number;
  quantity: number;
  amount: number;
  status: string;
  stampInvoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
}

export interface AddStampInvoice {
  indentId: number;
  stampIndentData: StampIndentData[];
}

export interface StampIndentData {
  stampCombinationId: number;
  sheet: number;
  label: number;
  quantity: number;
  amount: number;
}

export interface StampWalletGet {
  sheetLedgerBalance: number,
  labelLedgerBalance: number
  category: string,
  denomination: number
}
export interface StampWalletRefill {
  treasuryCode: string,
  combinationId: number,
  addSheet: number,
  addLabel: number
}

export interface AddStampCombination {
  stampTypeId: number;
  stampLabelId: number;
  stampCategoryId: number;
}



// =============Vendor Requisition==================
export interface GetVendorStampRequisition {
  vendorStampRequisitionId: number;
  vendorId: number;
  vendorName: string;
  vendorType: string;
  licenseNo: string;
  amount: number;
  quantity: number;
  status: string;
  requisitionDate: string;
  raisedToTreasury: string;
  sheet: number;
  label: number;
  requisitionNo: string;
}


export interface AddVendorStampRequisition {
  vendorId: number;
  sheet: number;
  label: number;
  combinationId: number;
  requisitionDate: string;
  requisitionNo: string;
  challanAmount: number;
  raisedToTreasury: string;
}

export interface PrintData {
  raisedToTreasury: string;
  hoa: string;
  detailHead: string;
  amount: number;
  vendorName: string;
  vendorAddress: string;
  treasuryName: string;
}

export interface ApprovedByClerk {
  vendorStampRequisitionId: number,
  sheetByClerk: number,
  labelByClerk: number
}

export interface ApprovedByTO {
  vendorStampRequisitionId: number,
  sheetByTo: number,
  labelByTo: number,
  discountedAmount: number,
  taxAmount: number,
  challanAmount: number,
}

export interface calcAmountDetails {
  amount: number,
  discountAmount: number,
  taxAmount: number,
  challanAmount: number
}
