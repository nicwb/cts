import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private messageService: MessageService) {}
    showAlert(message: string, alertType: number) {
        switch (alertType) {
        case AlertType.Success:
            this.showSuccess(message);
            break;
        case AlertType.Warning:
            this.showWarning(message);
            break;
        case AlertType.Error:
            this.showError(message);
            break;
        case AlertType.Info:
            this.showInfo(message);
            break;
        default:
            break;
        }
    }
    showSuccess(message: string, swal: boolean = true) {
        swal
            ? Swal.fire({
                icon: 'success',
                title: 'Success',
                text: '' + message,
            })
            : this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: message,
            });

    }

    showError(message: string, swal: boolean = true) {
        swal
            ? Swal.fire({
                icon: 'error',
                title: 'Aww! Snap...',
                text: '' + message,
            })
            : this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
            });
    }
    showWarning(message: string, swal: boolean = true) {
        swal
            ? Swal.fire({
                icon: 'warning',
                title: 'Heads up...',
                text: '' + message,
            })
            : this.messageService.add({
                severity: 'warn',
                summary: 'Warn',
                detail: message,
            });
    }
    showInfo(message: string, swal: boolean = true) {
        swal
            ? Swal.fire({ icon: 'info', title: 'Info', text: '' + message })
            : this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: message,
            });
    }

    needConfirmation(message: string): Promise<boolean> {
        return new Promise((resolve) => {
            Swal.fire({
                title: 'Are you sure?',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                resolve(result.isConfirmed);  // Resolve with true if confirmed, false otherwise
            });

        });
    }

}
export enum AlertType {
    Success = 1,
    Warning = 2,
    Error = 3,
    Info = 4,
}
