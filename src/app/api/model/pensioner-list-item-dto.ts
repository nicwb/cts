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


export interface PensionerListItemDTO { 
    dataSource?: { [key: string]: any; } | null;
    id?: number;
    ppoId?: number;
    pensionerName?: string | null;
    mobileNumber?: string | null;
    dateOfBirth?: string;
    dateOfRetirement?: string;
    dateOfCommencement?: string;
    ppoNo?: string | null;
}

