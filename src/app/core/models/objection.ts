export interface IObjection {
    id: number;
    description: string;
    objectionType: string;
}
export interface TokenWithObjections {
    id: number;
    toeknId: number;
    objectionId: number;
    objectionDescription: string;
    objectionBy: number;
    objectionType: string;
    objectionRemark: string;
    isOverruled?: boolean;
    OverruledBy?: string;
}
export interface ISetNewObjection {
    description: string;
}
