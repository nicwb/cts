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
import { ChequeInvoiceSeriesDTO } from './chequeInvoiceSeriesDTO';


export interface ChequeInvoiceDetailsByIdDTO { 
    id?: number;
    quantity?: number | null;
    chequeInvoiceSeries?: Array<ChequeInvoiceSeriesDTO> | null;
}

