import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-first-pension-pdf-viewer',
    template: `
    <div class="pdf-viewer-container">
      <div class="pdf-info">
        <h2>Bill Summary</h2>
        <p><strong>Status:</strong> {{ config.data.message }}</p>
      </div>
      <ng-container >
        <object [data]="safePdfDataUri" type="application/pdf" width="100%" height="650px"></object>
      </ng-container>
    </div>
  `,
    styles: [
        `.pdf-viewer-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .pdf-info {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 5px;
    }
  `
    ]
})
export class FirstPensionPdfViewerComponent implements OnInit {
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
