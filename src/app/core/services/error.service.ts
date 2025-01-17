import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { APIResponseStatus } from 'src/app/api';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor(private messageService: MessageService) {}

    handleError(error: any): void {
        let userMessage = 'Something went wrong!';
        if (error.status === 0) {
            userMessage = 'Network error. Please check your connection.';
        } else if (error.error.apiResponseStatus === 'Error') {
            this.handleDTOValidationError(error.error);
            return;
        } else if (error.status >= 400) {
            void Swal.fire({
                icon: 'error',
                title: error.error.Message,
                confirmButtonText: 'OK',
            });
            return;
        } else {
            userMessage = error.error?.message || 'An error occurred.';
        }
        void Swal.fire({
            icon: 'error',
            title: userMessage,
            confirmButtonText: 'OK',
        });
    }

    private handleDTOValidationError(apiError: any): void {
        for (let index = 0; index < apiError.result.length; index++) {
            const element = apiError.result[index];
            void Swal.fire({
                icon: 'error',
                title: element.errors[0].errorMessage,
                confirmButtonText: 'OK',
            });
            break;
        }
    }
}
