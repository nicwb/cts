import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private messageService: MessageService) { }
    showAlert(message: string,alertType:number){
        switch (alertType) {
        case 1:
            this.showSuccess(message);
            break;
        case 2:
            this.showWarning(message);
            break;      
        case 3:
            this.showError(message);
            break;
        case 4:
            this.showInfo(message);
            break;
        default:
            break;
        }
    }
    showSuccess(message: string) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }

    showError(message: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }
    showWarning(message: string) {
        this.messageService.add({ severity:'warn', summary: 'Warn', detail: message });
    }
    showInfo(message: string) {
        this.messageService.add({ severity:'info', summary: 'Info', detail: message });
    }
}
