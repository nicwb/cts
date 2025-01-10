export interface IapiResponce<T = null> {
    result: T | any;
    apiResponseStatus: number;
    message: string;
}
