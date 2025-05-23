import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    set(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    get(key: string): any {
        return localStorage.getItem(key);
    }

    del(key: string) {
        localStorage.removeItem(key);
    }
}
