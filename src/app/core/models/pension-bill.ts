export interface PensionBillResponse {
    result: Result;
    apiResponseStatus: number;
    message: string;
}

export interface Result {
    billGeneratedUptoDate: string;
    pensioner: Pensioner;
    bankAccount: BankAccount;
    pensionCategory: PensionCategory;
    pensionerPayments: PensionerPayment[];
    dataSource: any; // You can replace `any` with the appropriate type if known
}

export interface Pensioner {
    id: number;
    ppoId: number;
    pensionerName: string;
    mobileNumber: string;
    dateOfBirth: string;
    dateOfRetirement: string;
    dateOfCommencement: string;
    ppoNo: string;
    dataSource: any; // You can replace `any` with the appropriate type if known
}

export interface BankAccount {
    accountHolderName: string;
    bankAcNo: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    dataSource: any; // You can replace `any` with the appropriate type if known
}

export interface PensionCategory {
    id: number;
    categoryName: string;
    primaryCategory: PrimaryCategory;
    primaryCategoryId: number;
    subCategoryId: number;
    dataSource: any; // You can replace `any` with the appropriate type if known
}

export interface PrimaryCategory {
    id: number;
    hoaId: string;
    primaryCategoryName: string;
    dataSource: any; // You can replace `any` with the appropriate type if known
}

export interface PensionerPayment {
    fromDate: string;
    toDate: string;
    basicPensionAmount: number;
    breakupId: number;
    componentName: string;
    componentType: string;
    breakupAmount: number;
    rateId: number;
    rateType: string;
    rateAmount: number;
    periodInMonths: number;
    dueAmount: number;
    dataSource: any; // You can replace `any` with the appropriate type if known
}
