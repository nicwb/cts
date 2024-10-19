import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class FileGenerationBillPrintService {
    constructor() { }

    generatePdf(reportData: any, year: number, month: string, isAllBank: boolean, isAllCategory: boolean): void {
        const doc = new jsPDF();

        if (!reportData || !Array.isArray(reportData.regularBills) || reportData.regularBills.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No regular bills available for PDF generation.",
                confirmButtonText: "OK"
            });
            return;
        }

        reportData.regularBills.forEach((bill: any, index: number) => {
            if (index > 0) {
                doc.addPage();
            }
            const startY = this.addHeader(doc, bill, month, year);
            this.addTable(doc, bill.ppoBills, startY, bill);
            this.addFooter(doc, bill, reportData.regularBills);
        });

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const fileName = `Regular Pension Bill for ${month} ${year}.pdf`;

        Swal.fire({
            icon: 'success',
            title: 'PDF Generated',
            html: `
                <p>The PDF "${fileName}" has been generated.</p>
                <a href="${pdfUrl}" target="_blank" id="view-pdf-link">Click here to view the PDF</a>
            `,
            confirmButtonText: 'OK',
            didClose: () => {
                // Clean up the object URL when the dialog is closed
                URL.revokeObjectURL(pdfUrl);
            }
        });

        // Optionally, trigger the download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.click();
    }

    private addHeader(doc: jsPDF, bill: any, month: string, year: number): number {
        const startY = 10;
        doc.setFontSize(10);
        doc.text('Govt. of West Bengal - Treasury', 105, startY, { align: 'center' });
        doc.text(`${bill.treasuryName}`, 105, startY + 5, { align: 'center' });
        doc.text(`Bill for the Month of ${month} ${year}`, 105, startY + 10, { align: 'center' });
        doc.text(`For the Period of ${bill.fromDate} To ${bill.toDate}`, 105, startY + 15, { align: 'center' });
        doc.line(10, startY + 20, 200, startY + 20);
        doc.text(`Bank: ${bill.bankBranchName}`, 10, startY + 30);
        doc.text(`Head of Account: ${bill.hoaId}`, 10, startY + 35);
        doc.text(`Category: ${bill.category}`, 130, startY + 30);
        doc.text(`Bill Date: ${bill.billDate}`, 170, startY + 35);
        doc.text(`Bill Number: ${bill.billNo}`, 130, startY + 35);
        doc.text(`Voucher Number: ${bill.treasuryVoucherNo}`, 10, startY + 40);
        doc.text(`Voucher Date: ${bill.treasuryVoucherDate}`, 150, startY + 40);

        return startY + 50; // Return the Y position after the header
    }

    private addTable(doc: jsPDF, ppoBills: any[], startY: number, bill: any): number {
        const columns = [
            { header: 'Sl No', dataKey: 'slNo' },
            { header: 'PPO ID', dataKey: 'ppoId' },
            { header: 'PPO Number', dataKey: 'ppoNo' },
            { header: 'Pensioner Name', dataKey: 'pensionerName' },
            { header: 'Bank Account No', dataKey: 'bankAcNo' },
            { header: 'Total Payable', dataKey: 'totalPayableAmount' },
            { header: 'Basic Pension', dataKey: 'basicPensionAmount' },
            { header: 'DR', dataKey: 'dearnessReliefAmount' },
            { header: 'MR', dataKey: 'medicalReliefAmount' },
            { header: 'Commuted Amount', dataKey: 'commutedPensionAmount' },
            { header: 'Overdrawal', dataKey: 'overdrawlAmount' },
            { header: 'DP Pension', dataKey: 'dpPensionAmount' },
            { header: 'Additional Pension', dataKey: 'additionalPensionAmount' },
            { header: 'Arrear', dataKey: 'arrearPensionAmount' },
            { header: 'IR', dataKey: 'interimReliefAmount' },
            { header: 'By Transfer', dataKey: 'byTransferAmount' }
        ];

        let rows;

        if (!Array.isArray(ppoBills) || ppoBills.length === 0) {
            // Create a single row with the account head wise total
            rows = [
                [
                    {
                        content: `Account Head Wise Total: ${bill.grossAmount}`,
                        colSpan: columns.length, // Set colspan to the total number of columns
                        styles: { halign: 'center' } // Center align the text
                    }
                ]
            ];
        } else {
            // Proceed with the existing table generation logic if PPO Bills are available
            rows = ppoBills.map((bill, index) => [
                index + 1,
                bill.ppoId,
                bill.ppoNo,
                bill.pensionerName,
                bill.bankAcNo,
                bill.totalPayableAmount,
                bill.basicPensionAmount,
                bill.dearnessReliefAmount,
                bill.medicalReliefAmount,
                bill.commutedPensionAmount,
                bill.overdrawlAmount,
                bill.dpPensionAmount,
                bill.additionalPensionAmount,
                bill.arrearPensionAmount,
                bill.interimReliefAmount,
                bill.byTransferAmount
            ]);
        }

        // Call autoTable for both cases
        (doc as any).autoTable({
            head: [columns.map(col => col.header)],
            body: rows,
            startY: startY,
            theme: 'plain',
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak',
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
            }
        });

        return (doc as any).autoTable.previous.finalY + 10;
    }

    private addFooter(doc: jsPDF, bill: any, regularBills: any[]): void {
        const pageHeight = doc.internal.pageSize.height;
        const finalY = (doc as any).autoTable.previous.finalY + 10;

        if (finalY + 100 > pageHeight) {
            doc.addPage();
        }

        const footerStartY = doc.internal.pageSize.height - 100;

        // Only display the footer section when no PPO Bills are available
        if (!bill.ppoBills || bill.ppoBills.length === 0) {
            doc.setFontSize(8);
            doc.text('Bill Gross Rs. :' + bill.grossAmount, 10, footerStartY);
            doc.text('Net Amount:' + bill.netAmount, 70, footerStartY);
            doc.text('Pay Rs. :' + bill.payAmount, 10, footerStartY + 5);
            doc.text('Rupees (in words):' + bill.amountInWords, 70, footerStartY + 5);
            doc.text('By-Transfer Credit Rs. 0', 10, footerStartY + 10);
            doc.setFontSize(8);
            doc.text('INSTRUCTIONS', 60, footerStartY + 20);
            const instructions = [
                '1. The Pensioner\'s Single / Joint named account with the family pensioner will be operated for drawal of pension only.',
                '2. In the event of the death of the Pensioner, the Bank will intimate the actual date of death of the pensioner and the Bank will not release the Balance in the',
                '  account of the Pensioner unless clearance is received from Treasury.',
                '3. If the pension has remained undrawn for six months the Bank will send an intimation to that effect to the Treasury.'
            ];
            doc.text(instructions.join('\n'), 10, footerStartY + 30);
        }

        const billIndex = regularBills.indexOf(bill);
        if (billIndex === -1) {
            Swal.fire({
                icon: "info",
                title: "Bill not found in regular bills.",
                confirmButtonText: "OK"
            });
            return;
        }

        doc.setFontSize(8);
        doc.text(`Generated by ${bill.preparedBy}`, 10, doc.internal.pageSize.height - 10);
        doc.text(`Date: ${bill.preparedOn}`, 80, doc.internal.pageSize.height - 10);
        doc.text(`Page ${billIndex + 1} of ${regularBills.length}`, 180, doc.internal.pageSize.height - 10);
    }
}