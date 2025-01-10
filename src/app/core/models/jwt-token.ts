export interface IJwtToken {
    application: string;
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
    Id: number;
    Name: string;
    Scope: string[];
}

export interface Role {
    Id: number;
    Name: string;
    Permissions: string[];
}

export interface Application {
    Id: number;
    Name: string;
    Levels: Level[];
    Roles: Role[];
}

export interface IUserDetails {
    Id: number;
    Name: string;
    Role: string;
    Level: Level;
}
