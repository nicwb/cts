import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    // Function to convert base64 string to a PDF and open it in a new window
    base64ToPdf(base64String: string, fileName: string = 'document.pdf'): void {
        // Convert base64 string to byte array
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob with the PDF data
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a URL for the Blob and open it in a new window
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);

        // Optionally download the file
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();

        // Clean up the URL object after usage
        URL.revokeObjectURL(blobUrl);
    }

    // Function to convert base64 string to a PDF url that can be shown in a div using iframe
    base64ToPdfUrl(base64String: string): string {
        // Convert base64 string to byte array
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob with the PDF data
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create a URL for the Blob and return it
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
}
