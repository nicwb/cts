import { HoaChain } from './hoa-chain';

export interface newToken {
    billId: Number;
    physicalBillDate: string;
    remarks: string;
}
export interface GeneratedToken {
    tokenId: number;
    tokenNumber: number;
}
export interface tokenDetails {
    tokenId: number;
    tokenNumberr: Number;
    tokenDate: Date;
    currentStatus: string;
    currentStatusSlug: string;
    financialYear: string;
    referenceNo: string;
    ddoCode: string;
}
export interface tokenPrint {
    tokenNumber: Number;
    tokenDate: Date;
    billNo: number;
    billDate: Date;
    ddoCode: string;
    payeeDept: string;
    hoaChain: HoaChain;
    grossAmount: number;
    netAmount: number;
}
