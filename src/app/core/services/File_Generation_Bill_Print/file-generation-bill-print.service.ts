import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class FileGenerationBillPrintService {
    constructor() { }

    generatePdf(reportData: any, branchName: string, bankName: string, year: number, month: string, isAllBank: boolean, isAllCategory: boolean): void {     
        const doc = new jsPDF();
        const addHeader = (startY: number) => {
            const pageWidth = doc.internal.pageSize.getWidth();
            
            doc.setFontSize(10);
            doc.text('Govt. of West Bengal - Treasury', 105, startY, { align: 'center' });
            doc.text(`${branchName} I`, 105, startY + 5, { align: 'center' });
            
            doc.text(`Bill for the Month of ${month} ${year}`, 105, startY + 10, { align: 'center' });
            doc.text(`For the Period of ${reportData.bills.bills[0].fromDate}  To ${reportData.bills.bills[0].toDate}`, 105, startY + 15, { align: 'center' });
            doc.line(10, startY + 20, 200, startY + 20);
            doc.text(`Bank: ${bankName}`, 10, startY + 30);
            doc.text(`Head of Account: ${reportData.bills.bills[0].hoaId}`, 120, startY + 30);

            doc.text(`Category: ${reportData.bills.bills[0].ppoBills[0].pensioner.category.categoryName}`, 10, startY + 35);
            doc.text(`Bill Date: ${reportData.bills.bills[0].billDate}`, 130, startY + 35);

            doc.text(`Voucher Date: ${reportData.bills.bills[0].treasuryVoucherDate}`, 10, startY + 40);
            doc.text(`Bill Number: ${reportData.bills.bills[0].billNo}`, 170, startY + 35);
            doc.text(`Voucher Number: ${reportData.bills.bills[0].treasuryVoucherNo}`, 150, startY + 40);

        };
        

        const addTable = (startY: number, data: any[], isAccountHeadWiseTotal: boolean) => {
            const columns = ["Sl No", "PPO ID", "Pensioner Name", "Bank A/C No", "Total Payable", "Basic Pension", "DR", "MR", "Commuted Amount", "Overdrawal", "DP", "Additional Pension", "Arrear", "IR", "By-Transfer"];
            
            let rows: any[] = [];

            if (isAccountHeadWiseTotal) {
                if (Array.isArray(reportData.bills)) {
                    if (reportData.bills.billCount === 1) {
                        rows = [['', '', 'Account Head Wise Total', '', reportData.bills.bills[0].netAmount || 'N/A', '', '', '', '', '', '', '', '', '', '']];
                    } else {
                        rows = reportData.bills.map((bill: any, index: number) => 
                            ['', '', `Account Head Wise Total ${index + 1}`, '', bill.netAmount || 'N/A', '', '', '', '', '', '', '', '', '', '']
                        );
                    }
                } else if (reportData.bills && typeof reportData.bills === 'object') {
                    // If bills is an object, not an array
                    rows = [['', '', 'Account Head Wise Total', '', reportData.bills.bills[0].netAmount || 'N/A', '', '', '', '', '', '', '', '', '', '']];
                } else {
                    console.error('Unexpected reportData.bills structure:', reportData.bills);
                    rows = [['', '', 'Error: Invalid data structure', '', '', '', '', '', '', '', '', '', '', '', '']];
                }
            } else {
                if (Array.isArray(data)) {
                    rows = data.flatMap((bill: any) => 
                        (Array.isArray(bill.ppoBills) ? bill.ppoBills : []).map((ppoBill: any, index: number) => [
                            index + 1,
                            ppoBill.pensioner?.ppoId || 'N/A',
                            ppoBill.pensioner?.pensionerName || 'N/A',
                            ppoBill.pensioner?.bankAccounts?.[0]?.bankAcNo || 'N/A',
                            ppoBill.ppoBillBreakups?.[0]?.netAmount || 'N/A',
                            ppoBill.pensioner?.basicPensionAmount || 'N/A',
                            ppoBill.ppoBillBreakups?.[1]?.netAmount || 'N/A',
                            ppoBill.ppoBillBreakups?.[2]?.netAmount || 'N/A',
                            ppoBill.pensioner?.commutedPensionAmount || 'N/A',
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ])
                    );
                } else {
                    console.error('Unexpected data structure:', data);
                    rows = [['', '', 'Error: Invalid data structure', '', '', '', '', '', '', '', '', '', '', '', '']];
                }
            }

            (doc as any).autoTable({
                head: [columns],
                body: rows,
                startY: startY,
                theme: 'grid',
                styles: { fontSize: 8, cellPadding: 1 },
                headStyles: { fillColor: [100, 100, 100] },
            });

            return (doc as any).lastAutoTable.finalY + 10;
        };

        // Add header and tables
        addHeader(10);
        let finalY: number;

        if (isAllBank && isAllCategory) {
            finalY = addTable(55, reportData.bills.bills, true);
            addHeader(finalY + 20);
            finalY = addTable(finalY + 70, reportData.bills.bills, true);
        } else if (isAllBank) {
            // All bank, specific category
            finalY = addTable(55, reportData.bills.bills, true);
            addHeader(finalY + 20);
            finalY = addTable(finalY + 70, reportData.bills.bills, false);
        } else if (isAllCategory) {
            // Specific bank, all category
            finalY = addTable(55, reportData.bills.bills, false);
            addHeader(finalY + 20);
            finalY = addTable(finalY + 70, reportData.bills.bills, true);
        } else {
            // Specific bank, specific category
            finalY = addTable(55, reportData.bills.bills, false);
            addHeader(finalY + 20);
            finalY = addTable(finalY + 70, reportData.bills.bills, false);
        }

        // Add footer details
        doc.setFontSize(8); 
        doc.text('Bill Gross Rs. :', 10, finalY + 40);
        doc.text(reportData.bills.bills[0].ppoBills[0].grossAmount.toString(), 50, finalY + 40);

        doc.setFontSize(8); 
        doc.text('Net Amount:', 70, finalY + 40);
        doc.text(reportData.bills.bills[0].ppoBills[0].netAmount.toString(), 100, finalY + 40);

        doc.setFontSize(8);
        doc.text(`Pay Rs. :`, 10, finalY + 45);
        doc.text(reportData.bills.bills[0].ppoBills[0].grossAmount.toString(), 50, finalY + 45);
        //write func for rupees in words
        doc.text('Rupees (in words):', 70, finalY + 45);
        //doc.text(reportData.amountInWords, 100, finalY + 45);
        //what about transfer credit
        doc.text('By-Transfer Credit Rs. 0', 10, finalY + 50);

        // Adjust instructions section
        doc.setFontSize(8);
        doc.text('INSTRUCTIONS', 60, finalY + 60);
        const instructions = [
            '1. The Pensioner\'s Single / Joint named account with the family pensioner will be operated for drawal of pension only.',
            '2. In the event of the death of the Pensioner, the Bank will intimate the actual date of death of the pensioner and the Bank will not release the Balance in the', 
            '  account of the Pensioner unless clearance is received from Treasury.',
            '3. If the pension has remained undrawn for six months the Bank will send an intimation to that effect to the Treasury.'
        ];
        doc.text(instructions.join('\n'), 10, finalY + 70);

        // Move the "Prepared by" and "Prepared on" to the bottom of the page
        doc.setFontSize(8);
        doc.text(`Generated by ${reportData.bills.preparedBy}`, 10, doc.internal.pageSize.height - 20);
        doc.text(`Date: ${reportData.bills.preparedOn}`, 10, doc.internal.pageSize.height - 15);
        doc.text(` Page 1 of ${reportData.bills.billCount}`, 180, doc.internal.pageSize.height - 15);


        // Save the PDF
        doc.save('bill-report.pdf');
    }
}
