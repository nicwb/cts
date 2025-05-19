import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
// import { environment } from '@E/environment';
import { catchError, map, filter } from 'rxjs/operators';
import { CryptoService } from './crypto.service';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class localStorageService {
    static crypto: any = new CryptoService();
    constructor(private crypto: CryptoService) {}
    // set(key:string,value:any){
    //     localStorage.setItem(key,this.crypto.set(environment.AesKey,value));
    // }
    // get(key:string):any{
    //     return localStorage.getItem(key) ==null ? null : this.crypto.get(environment.AesKey,localStorage.getItem(key));
    // }
    del(key: string) {
        localStorage.removeItem(key);
    }
    static set(key: string, value: any) {
        //Fix
        //key = this.crypto.set(environment.AesKey, key);
        //Fix
        //localStorage.setItem(key, this.crypto.set(environment.AesKey, value));
        // console.log(localStorage.setItem(key, this.crypto.set(environment.AesKey, value)));
    }
    static get(key: string): any {
        //Fix
        //key = this.crypto.set(environment.AesKey, key);
        // console.log(localStorage.getItem(key) == null ? null : this.crypto.get(environment.AesKey, localStorage.getItem(key)));
        // const ss = localStorage.getItem(key) == null ? null : this.crypto.get(environment.AesKey, localStorage.getItem(key))
        //Fix
        //return localStorage.getItem(key) == null ? null : this.crypto.get(environment.AesKey, localStorage.getItem(key));
    }
    static del(key: string) {
        //Fix
        //key = this.crypto.set(environment.AesKey, key);
        localStorage.removeItem(key);
    }
}
