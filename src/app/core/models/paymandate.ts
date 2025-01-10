import { HoaChain } from './hoa-chain';

export interface Paymandate {
    selectedDate: any;
    tokenId: number;
    tokenDate: Date;
    billNo: string;
    billDate: Date;
    trFormats: string;
    billTypes: string;
    billModule: string;
    billPeriod: string;
    noOfBeneficiarie: number;
    neAmount: number;
    ecsAmount: number;
    chequeAmount: number;
    detailHead: string;
    headOfAccounts: HoaChain;
    ddoCode: string;
}
