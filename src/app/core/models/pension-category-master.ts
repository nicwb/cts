export interface PrimaryCategoryEntryDTO {
    HoaId: string,
    PrimaryCategoryName: string
}

export interface SubCategoryEntryDTO {
    SubCategoryName: string
}

export interface CategoryEntryDTO {
    PrimaryCategoryId: number,
    SubCategoryId: number
}

export interface CategoryResponseDTO {
    Id: number,
    CategoryName: string
}

export interface PrimaryCategoryResponseDTO {
    Id: number
}

export interface SubCategoryResponseDTO {
    Id: number
}
