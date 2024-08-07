/**
 * CTS-BE
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PensionPrimaryCategoryResponseDTO } from './pensionPrimaryCategoryResponseDTO';
import { PensionSubCategoryResponseDTO } from './pensionSubCategoryResponseDTO';
import { ComponentRateResponseDTO } from './componentRateResponseDTO';


export interface PensionCategoryResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    primaryCategoryId?: number;
    subCategoryId?: number;
    id?: number;
    categoryName?: string | null;
    primaryCategory?: PensionPrimaryCategoryResponseDTO;
    subCategory?: PensionSubCategoryResponseDTO;
    componentRates?: Array<ComponentRateResponseDTO> | null;
}

