import React from 'react';
import jsPDF from 'jspdf';
import type { BillResponse } from '../types';

interface BillResultProps {
    bill: BillResponse;
}

const BillResult: React.FC<BillResultProps> = ({ bill }) => {
    const formatCurrency = (amount: number): string => {
        return `$${amount.toFixed(2)}`;
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Utility Bill Statement', 105, 20, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${formatDate(bill.calculatedAt)}`, 105, 30, {
            align: 'center',
        });

        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Bill details
        doc.setFontSize(12);
        let y = 50;

        doc.text('Consumption Details:', 20, y);
        y += 10;
        doc.text(`Units Consumed: ${bill.unitsConsumed.toFixed(2)} kWh`, 30, y);
        y += 8;
        doc.text(
            `Rate per Unit: ${formatCurrency(bill.ratePerUnit)}/kWh`,
            30,
            y
        );

        y += 15;
        doc.text('Charges Breakdown:', 20, y);
        y += 10;
        doc.text(
            `Subtotal (Units × Rate): ${formatCurrency(bill.subtotal)}`,
            30,
            y
        );
        y += 8;
        doc.text(
            `VAT (${bill.vatPercentage}%): ${formatCurrency(bill.vatAmount)}`,
            30,
            y
        );
        y += 8;
        doc.text(
            `Fixed Service Charge: ${formatCurrency(bill.fixedServiceCharge)}`,
            30,
            y
        );

        // Total line
        y += 15;
        doc.setLineWidth(0.3);
        doc.line(20, y, 190, y);

        y += 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(
            `Total Amount Payable: ${formatCurrency(bill.totalAmount)}`,
            30,
            y
        );

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for your business!', 105, 280, { align: 'center' });

        // Save PDF
        doc.save(`utility-bill-${new Date().getTime()}.pdf`);
    };

    return (
        <div className="mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    📄 Bill Calculation Result
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Calculated on: {formatDate(bill.calculatedAt)}
                </p>

                <div className="bg-white rounded-lg p-6 mb-4">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                        Consumption Details
                    </h3>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">Units Consumed:</span>
                        <strong className="text-gray-800">
                            {bill.unitsConsumed.toFixed(2)} kWh
                        </strong>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-gray-600">Rate per Unit:</span>
                        <strong className="text-gray-800">
                            {formatCurrency(bill.ratePerUnit)}/kWh
                        </strong>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 mb-4">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                        Charges Breakdown
                    </h3>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">
                            Subtotal (Units × Rate):
                        </span>
                        <strong className="text-gray-800">
                            {formatCurrency(bill.subtotal)}
                        </strong>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600">
                            VAT ({bill.vatPercentage}%):
                        </span>
                        <strong className="text-gray-800">
                            {formatCurrency(bill.vatAmount)}
                        </strong>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-gray-600">
                            Fixed Service Charge:
                        </span>
                        <strong className="text-gray-800">
                            {formatCurrency(bill.fixedServiceCharge)}
                        </strong>
                    </div>
                </div>

                <div className="bg-indigo-600 text-white rounded-lg p-6 mb-6 flex justify-between items-center">
                    <span className="text-lg font-semibold">
                        Total Amount Payable:
                    </span>
                    <strong className="text-2xl">
                        {formatCurrency(bill.totalAmount)}
                    </strong>
                </div>

                <button
                    onClick={downloadPDF}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    📥 Download as PDF
                </button>
            </div>
        </div>
    );
};

export default BillResult;
