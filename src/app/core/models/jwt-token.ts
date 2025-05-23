export interface IJwtToken {
    application: any;
    role: string;
    permissions: string[];
    level: string;
    scope: string;
    nameid: string;
    name: string;
    nbf: number;
    exp: number;
    iat: number;
}

export interface IJwtDecodedToken {
    application: Application;
    nameid: string;
    name: string;
    nbf: number;
    exp: number;
    iat: number;
}
interface Level {
    id: number;
    name: string;
    scope: string;
}

export interface Role {
    name: string;
    permissions: string[];
}

export interface Application {
    id: number;
    name: string;
    role: Role;
}

export interface IUserDetails {
    id: number;
    name: string;
    role: string;
    level: string;
    scope: string;
}
