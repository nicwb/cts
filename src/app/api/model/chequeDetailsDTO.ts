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
import { ChequeListDTOs } from './chequeListDTOs';


export interface ChequeDetailsDTO { 
    billNo?: string | null;
    billDate?: string | null;
    grossAmount?: number | null;
    netAmount?: number | null;
    chequeAmount?: number | null;
    payMode?: string | null;
    chequeDetails?: Array<ChequeListDTOs> | null;
}

