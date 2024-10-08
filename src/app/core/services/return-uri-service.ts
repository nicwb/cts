import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReturnUriService {
    private _returnUri: string | null = null;

    setReturnUri(uri: string | null) {
        this._returnUri = uri;
    }

    getReturnUri(): string | null {
        return this._returnUri;
    }
}