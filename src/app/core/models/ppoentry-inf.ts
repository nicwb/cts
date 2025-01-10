export interface PPOEntryINF {
    receiptId: number; // integer($int64)
    ppoNo: string; // string with maxLength: 100, minLength: 0, nullable: true
    ppoType: 'P' | 'F' | 'C'; // string with pattern: [PFC]
    ppoSubType:
        | 'E'
        | 'L'
        | 'U'
        | 'V'
        | 'N'
        | 'R'
        | 'P'
        | 'G'
        | 'J'
        | 'K'
        | 'H'
        | 'W'; // string with pattern: [ELUVNRPGJKHW]
    categoryId: number; // integer($int64)
    pensionerName?: string; // string with maxLength: 100, minLength: 0, nullable: true
    gender?: 'M' | 'F'; // string with pattern: [MF], nullable: true
    dateOfBirth?: string; // DateOnly as string
    mobileNumber?: string; // string with maxLength: 10, minLength: 0, pattern: ^[6-9]\d{9}$
    emailId?: string; // nullable: true
    pensionerAddress?: string; // nullable: true
    identificationMark?: string; // nullable: true
    panNo?: string; // nullable: true
    aadhaarNo?: string; // nullable: true
    dateOfRetirement?: string; // DateOnly as string
    dateOfCommencement?: string; // DateOnly as string
    basicPensionAmount: number; // integer($int32)
    commutedPensionAmount: number; // integer($int32)
    enhancePensionAmount: number; // integer($int32)
    reducedPensionAmount: number; // integer($int32)
    religion?: 'H' | 'M' | 'O'; // string with pattern: [HMO]
}

// bank details interface
export interface CreatePensonarBankDTO {
    accountHolderName: string;
    bankAcNo: number;
    ifscCode: string;
    bankName: string;
    branchName: string;
}
