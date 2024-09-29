import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private router: Router, private location: Location) { }

    navigateTo(targetUrl: string, returnUri: string, ask?: string) {
        this.router.navigate([targetUrl], {
            queryParams: { 'return-uri': returnUri, 'ask': ask }
        });
    }

    confirmReturnToCaller() {
        const returnUri = this.getReturnUri();
        const ask = this.getAskQuestion();
        if (!ask){
            return;
        }

        Swal.fire({
            title: 'Confirmation',
            text: ask,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                if (returnUri) {
                    this.router.navigate([returnUri]);
                } else {
                    this.location.back();
                }
            }
        });
    }

    getReturnUri(): string | null {
        const urlTree = this.router.parseUrl(this.router.url);
        return urlTree.queryParams['return-uri'] || null;
    }

    getAskQuestion(): string | null {
        const urlTree = this.router.parseUrl(this.router.url);
        return urlTree.queryParams['ask'] || null;
    }
}