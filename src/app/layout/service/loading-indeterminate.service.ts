import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingIndeterminateService {

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    showLoading() {
        this.loading$.next(true);
    }

    hideLoading() {
        this.loading$.next(false);
    }
}
