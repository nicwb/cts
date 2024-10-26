import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SpinnerService {
    private showSpinner = true;

    setSpinnerVisibility(visible: boolean): void {
        this.showSpinner = visible;
    }

    isSpinnerVisible(): boolean {
        return this.showSpinner;
    }
}
