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


export interface ManualPpoReceiptResponseDTO { 
    dataSource?: { [key: string]: any; } | null;
    ppoNo: string;
    pensionerName: string;
    dateOfCommencement: string;
    mobileNumber?: string | null;
    receiptDate: string;
    psaCode: string;
    ppoType: string;
    id?: number;
    treasuryReceiptNo?: string | null;
}

