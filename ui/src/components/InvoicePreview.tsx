import React from 'react';
import { CompanyProfile, RecipientProfile, InvoiceItem } from '../types/types';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoicePreviewProps {
  companyProfile: CompanyProfile | null;
  recipientProfile: RecipientProfile | null;
  items: InvoiceItem[];
  invoiceNumber?: string; // Optional override
}

const InvoicePreviewComponent: React.FC<InvoicePreviewProps> = ({ companyProfile, recipientProfile, items, invoiceNumber }) => {

  if (!companyProfile || !recipientProfile) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Please select a recipient and ensure company profile is set.</p>
        </CardContent>
      </Card>
    );
  }

  const calculateItemAmount = (item: InvoiceItem): number => {
    return (item.rate ? (item.amount * item.rate) : item.amount) + (item.additional || 0);
  };

  const totalAmount = items
    .filter(item => !item.exclude)
    .reduce((sum, item) => sum + calculateItemAmount(item), 0)
    .toFixed(2);

  const currentDate = moment().format('DD.MM.YYYY');
  const currentMonth = moment().format('MM');
  const currentYear = moment().format('YY');
  const currentFullYear = moment().format('YYYY');
  const defaultInvoiceIndex = '001'; // Or generate dynamically if needed
  const finalInvoiceNumber = invoiceNumber || `${currentYear}-${currentMonth}-${defaultInvoiceIndex}`;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Basic preview mimicking the template structure */}
        <div className="border p-4 space-y-4 text-sm">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              {/* Company Logo Placeholder */}
            </div>
            <div className="text-right">
              <p>{companyProfile.name}</p>
              <p>{companyProfile.address}</p>
              {companyProfile.email && <p>{companyProfile.email}</p>}
              {companyProfile.telephone && <p>{companyProfile.telephone}</p>}
            </div>
          </div>

          {/* Information */}
          <div className="flex justify-between items-start mt-4">
            <div>
              <p>{companyProfile.companyLongName}</p>
              <p>{companyProfile.companyAddressLine1}</p>
              <p>{companyProfile.companyAddressLine2}</p>
              <p>{companyProfile.companyCountry}</p>
            </div>
            <div className="text-right">
              <p>Date: {currentDate}</p>
            </div>
          </div>

          {/* Invoice Number */}
          <div className="mt-4">
            <p className="font-bold">Invoice No. {finalInvoiceNumber}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-2 font-bold">Description</th>
                <th className="text-right p-2 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                !item.exclude && (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      {item.description}
                      {!item.hideFromTo && (
                        <br />
                      )}
                      {!item.hideFromTo && (
                         <span className="text-xs text-gray-600">
                           {item.fromOverride || `1.${currentMonth}.${currentFullYear}`} to {item.toOverride || moment().endOf('month').format('DD.MM.YYYY')}
                         </span>
                      )}
                    </td>
                    <td className="text-right p-2">
                      {calculateItemAmount(item).toFixed(2)} EUR
                    </td>
                  </tr>
                )
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2">
                <td className="text-right p-2">Total Amount:</td>
                <td className="text-right p-2">{totalAmount} EUR</td>
              </tr>
            </tfoot>
          </table>

           {/* Footer Info */}
           <div className="mt-6 text-xs space-y-2">
             <p className="font-bold">Payment Method:</p>
             <p>Wire Transfer to:</p>
             <p>Name: {recipientProfile.bankName || recipientProfile.name}</p>
             <p>Bank: {recipientProfile.bank}</p>
             <p>IBAN: {recipientProfile.IBAN}</p>
             <p>BIC: {recipientProfile.BIC}</p>
           </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreviewComponent;

