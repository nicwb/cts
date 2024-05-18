export interface GetStampTypes {
    denomination?: number;
    isActive?: boolean;
    createdAt?: string;
    createdBy?: number;
}

export interface AddStampType {
    denomination?: number;
    isActive?: boolean;
}

export interface GetStampLabels {
    noLabelPerSheet?: number;
    isActive?: boolean;
    createdAt?: string;
    createdBy?: number;
}

export interface AddStampLabel {
    noLabelPerSheet?: number;
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
    isActive: boolean;
    createdAt: string;
    createdBy: number;
}

export interface GetStampVendors {
    stampVendorId?: number;
    vendorType?: number;
    licenseNo?: string;
    address?: string;
    phoneNumber?: number;
    effectiveFrom?: string;
    validUpto?: string;
    panNumber?: string;
    isActive?: boolean;
    activeAtGrips?: boolean;
    createdAt?: string;
    createdBy?: number;
}

export interface AddStampVendors {
    vendorType?: number;
    licenseNo?: string;
    address?: string;
    phoneNumber?: number;
    effectiveFrom?: string;
    validUpto?: string;
    panNumber?: string;
    isActive?: boolean;
    activeAtGrips?: boolean;
}
