import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class PdfGenerationService {
    constructor() { }

    generatePdf(reportData: any): void {
        console.log("Report Data: ", reportData);

      
        const doc = new jsPDF();

        const addHeader = (startY: number) => {
            doc.setFontSize(14); 
            doc.text('Government of West Bengal - Treasury', doc.internal.pageSize.getWidth() / 2, startY, { align: 'center' });

            doc.setFontSize(12); 
            doc.text(`${reportData.branchName} I`, doc.internal.pageSize.getWidth() / 2, startY + 8, { align: 'center' }); 

            doc.setFontSize(11); 
            doc.text('First Pension Bill', doc.internal.pageSize.getWidth() / 2, startY + 16, { align: 'center' });

            doc.setFontSize(10); 
            doc.text(`For the Period of ${reportData.response.result.pensioner.dateOfCommencement} To ${reportData.response.result.billDate}`, 
                doc.internal.pageSize.getWidth() / 2, startY + 24, { align: 'center' }); 


      
            doc.line(10, startY + 27, 200, startY + 27);

            doc.setFontSize(8);
            doc.text(`BILL ID: ${reportData.response.result.id}`, 10, startY + 30);
            doc.text(`VOUCHER NUMBER: ${reportData.response.result.treasuryVoucherNo}`, 130, startY + 30);
            doc.text(`BILL DATE: ${reportData.response.result.billDate}`, 10, startY + 35);
            doc.text(`VOUCHER DATE: ${reportData.response.result.treasuryVoucherDate}`, 130, startY + 35);
            doc.text(`PPO ID: ${reportData.response.result.pensioner.ppoId}`, 10, startY + 40);
            doc.text(`PPO NUMBER: ${reportData.response.result.pensioner.ppoNo}`, 130, startY + 40);
            const bankName = reportData.bankName && reportData.bankName[0] ? reportData.bankName[0].name : 'Unknown Bank Name';
            doc.text(`BANK NAME: ${bankName}`, 10, startY + 45);
            doc.text(`BANK ACCOUNT: ${reportData.response.result.pensioner.bankAccounts[0].bankAcNo}`, 130, startY + 45);
            doc.text(`BANK ADDRESS: ${reportData.branchAddress}`, 10, startY + 50);
            doc.text(`COMMENCEMENT DATE: ${reportData.response.result.pensioner.dateOfCommencement}`, 10, startY + 55);
            doc.text(`ACCOUNT HEAD: ${reportData.response.result.pensioner.category.primaryCategory.hoaId}`, 130, startY + 55);
            doc.text('SANCTION ORDER NUMBER: L/P/00704/2024', 10, startY + 60);
            doc.text(`PENSIONER NAME: ${reportData.response.result.pensioner.pensionerName} `, 130, startY+60);
            doc.text(`CATEGORY: ${reportData.response.result.pensioner.category.categoryName} `, 10, startY+ 65);
        };

        const addTable = (startY: number, data: any[]) => {
            const columns = ["Period","Component Description", "Due Amount", "Drawn Amount", "Paid/Deduct", "Net Amount"];
            const rows = data.map((item: any, index: number) => [
                item.fromDate + ' To ' + item.toDate,
                item.revision.rate.breakup.componentName,
                item.breakupAmount,
                item.drawnAmount,
                item.revision.rate.breakup.componentType,
                item.netAmount
            ]);

      

      
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

    
        addHeader(10);
        let finalY = addTable(80, reportData.response.result.ppoBillBreakups
        );

    

        // doc.text('Bill Gross Rs. :', 10, finalY);
        // doc.text('828230', 50, finalY);
        // doc.text('Bill Net Rs. :', 70, finalY);
        // doc.text('828230', 100, finalY);
        // doc.text(`By-transfer:`, 10, finalY + 10);
        // doc.text('37776', 50, finalY + 10);
        // doc.text('TDS:', 70, finalY+10);
        // doc.text('8658-00-112-001-20', 100, finalY+10);
        // doc.text('BILL NUMBER: 2277', 10, finalY + 20);
        // doc.text(`BILL DATE: 07/08/2024`, 10, finalY + 25);
        // doc.text(`PPO ID: 27698`, 10, finalY + 30);
        // doc.text(`PPO NUMBER: PRI/S/MLD/K/00010/2024`, 150, finalY + 30);
        //doc.text('Pay Rs. ***790454( Seven Lakh Ninety Thousand Four Hundred and Fifty Four Only) as per beneficiary list encolsed though ECS', 10, finalY + 35);
        doc.text('Date of Issue of Cheque.......',10, finalY + 50);
        doc.text('Cheque Number: ', 10, finalY + 55);

        doc.line(150, finalY + 40, 200, finalY + 40);
        doc.text('Treasury Officer/ Addl. Treasury Officer', 150, finalY + 45);
        doc.line(150, finalY + 65, 200, finalY + 65);
        doc.text('Treasury Officer/ Addl. Treasury Officer', 150, finalY + 70);


    
        doc.text('INSTRUCTIONS', 60, finalY + 80);
        const instructions = [
            '1. The Pensioner\'s Single / Joint named account with the family pensioner will be operated for drawal of pension only.',
            '2. In the event of the death of the Pensioner, the Bank will intimate the actual date of death of the pensioner and the Bank will not release the Balance in the account of the Pensioner unless clearance is received from Treasury.',
            '3. If the pension has remained undrawn for six months the Bank will send an intimation to that effect to the Treasury.'
        ];
        doc.text(instructions.join('\n'), 10, finalY + 85);

    
        doc.text('T.O. / A.T.O', 170, finalY + 110);
        doc.text(`Generated by ${reportData.response.result.preparedBy}`, 10, finalY + 115);
        doc.text(`Date: ${reportData.response.result.preparedOn}`, 10, finalY + 120);

    
        doc.save('bill-report.pdf');
    }
}
