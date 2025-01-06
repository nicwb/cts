import {
    Component,
    OnInit,
    HostListener,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pdf-viewer',
    template: `
        <div class="pdf-viewer-container" #container>
            <div class="pdf-info">
                <h2>Bill Summary</h2>
                <p><strong>Status:</strong> {{ config.data.message }}</p>
                <p>
                    <strong>Number of PPOs:</strong> {{ config.data.ppoCount }}
                </p>
                <p>
                    <strong>Total Bill Amount:</strong> ₹{{
                        config.data.totalAmount | number : '1.2-2'
                    }}
                </p>
                <p>
                    <strong>Generated On:</strong>
                    {{ config.data.generatedDate | date : 'medium' }}
                </p>
            </div>
            <ng-container *ngIf="config.data.pdfData">
                <object
                    [data]="safePdfDataUri"
                    type="application/pdf"
                    width="100%"
                    [height]="pdfHeight"
                ></object>
            </ng-container>
        </div>
    `,
    styles: [
        `
            .pdf-viewer-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
                height: 100%; /* Ensure the container takes full height */
                overflow: hidden; /* Prevent overflow */
            }
            .pdf-info {
                background-color: #f0f0f0;
                padding: 15px;
                border-radius: 5px;
            }
            object {
                flex-grow: 1; /* Allow the PDF object to grow and fill the space */
                overflow: hidden; /* Prevent overflow in the object */
                height: 100%; /* Ensure the object takes full height */
            }
        `,
    ],
})
export class PdfViewerComponent implements OnInit {
    safePdfDataUri?: SafeResourceUrl;
    pdfHeight: string = '500px'; // Default height

    @ViewChild('container') container?: ElementRef;

    constructor(
        public config: DynamicDialogConfig,
        private sanitizer: DomSanitizer,
        public ref: DynamicDialogRef // Inject DynamicDialogRef
    ) {}

    ngOnInit() {
        if (this.config.data.pdfData) {
            this.safePdfDataUri = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.config.data.pdfData
            );
        }
        this.updatePdfHeight(); // Set initial height
        this.ref.onMaximize.subscribe(() => this.onMaximize());
        this.ref.onClose.subscribe(() => this.onClose());
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.updatePdfHeight();
    }

    private onMaximize() {
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        this.updatePdfHeight(); // Update height on maximize
    }

    private onClose() {
        document.body.style.overflow = ''; // Reset body scroll
    }

    private updatePdfHeight() {
        if (this.container) {
            const dialogHeight = this.container.nativeElement.offsetHeight;
            this.pdfHeight = `${dialogHeight - 200}px`; // Adjust based on your layout
        }
    }
}
