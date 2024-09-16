import { Component } from '@angular/core';
import { LoadingIndeterminateService } from '../service/loading-indeterminate.service';

@Component({
    selector: 'app-loading-indeterminate',
    templateUrl: './loading-indeterminate.component.html'
})
export class LoadingIndeterminateComponent {
    loading$ = this.loadingIndeterminateService.loading$;
    constructor(private loadingIndeterminateService: LoadingIndeterminateService) {}
}
