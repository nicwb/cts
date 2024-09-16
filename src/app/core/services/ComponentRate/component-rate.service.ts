import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast.service';

@Injectable({
    providedIn: 'root',
})
export class ComponentRateService {
    // http requst service
    constructor(private http:HttpClient, private toastService:ToastService) {}
}
