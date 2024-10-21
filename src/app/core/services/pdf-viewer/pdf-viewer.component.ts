import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-pdf-viewer',
    template: `
    <div class="pdf-viewer-container">
      <div class="pdf-info">
        <h2>Bill Summary</h2>
        <p><strong>Status:</strong> {{ config.data.message }}</p>
        <p><strong>Number of PPOs:</strong> {{ config.data.ppoCount }}</p>
        <p><strong>Total Bill Amount:</strong> ₹{{ config.data.totalAmount | number:'1.2-2' }}</p>
        <p><strong>Generated On:</strong> {{ config.data.generatedDate | date:'medium' }}</p>
      </div>
      <ng-container *ngIf="config.data.pdfData">
        <iframe [src]="safePdfDataUri" width="100%" height="500px"></iframe>
      </ng-container>
    </div>
  `,
    styles: [`
    .pdf-viewer-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .pdf-info {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 5px;
    }
  `]
})
export class PdfViewerComponent implements OnInit {
    safePdfDataUri?: SafeResourceUrl;

    constructor(
    public config: DynamicDialogConfig,
    private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        if (this.config.data.pdfData) {
            this.safePdfDataUri = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.data.pdfData);
        }
    }
}