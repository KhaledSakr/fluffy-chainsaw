import React from 'react';
import { render, screen, within, act } from '../../../test-utils/test-utils';
import InvoicePreviewComponent from './InvoicePreview';
import { CompanyProfile, RecipientProfile, InvoiceItem } from '../../../types/invoice';
import moment from 'moment';

// Mock data for testing
const testCompany: CompanyProfile = {
  companyName: 'Test Co',
  companyAddress: '123 Test St',
  companyVat: 'VAT123',
  companyRegNo: 'REG456',
  companyBankName: 'Test Bank',
  companyBankIban: 'IBAN789',
  companyBankSwift: 'SWIFT012',
};

const testRecipient: RecipientProfile = {
  id: 'rec-1',
  name: 'Test Recipient',
  address: '456 Recipient Ave',
  vat: 'VATREC321',
  regNo: 'REGREC654',
  bankIban: 'IBANREC987',
  bankSwift: 'SWIFTREC210',
  items: [], // Items not needed for this component's props
};

const testItems: InvoiceItem[] = [
  { id: 'item-1', description: 'Service A', amount: 100, rate: 1.0 },
  { id: 'item-2', description: 'Service B', amount: 200, rate: 1.5, additional: 50 },
];

// Define a consistent test date
const testDate = new Date(2024, 4, 1).toISOString(); // May 1, 2024

describe('InvoicePreviewComponent', () => {
  test('renders company and recipient details correctly using data-testid', () => {
    render(<InvoicePreviewComponent company={testCompany} recipient={testRecipient} items={[]} date={testDate} />);

    // Check company details
    const companyDetails = screen.getByTestId('preview-company-details');
    expect(within(companyDetails).getByText('Test Co')).toBeInTheDocument();
    expect(within(companyDetails).getByText('123 Test St')).toBeInTheDocument();
    expect(within(companyDetails).getByText('VAT: VAT123')).toBeInTheDocument();
    expect(within(companyDetails).getByText('Reg No: REG456')).toBeInTheDocument();

    // Check recipient details
    const recipientDetails = screen.getByTestId('preview-recipient-details');
    expect(within(recipientDetails).getByText('Test Recipient')).toBeInTheDocument();
    expect(within(recipientDetails).getByText('456 Recipient Ave')).toBeInTheDocument();
    expect(within(recipientDetails).getByText('VAT: VATREC321')).toBeInTheDocument();
    expect(within(recipientDetails).getByText('Reg No: REGREC654')).toBeInTheDocument();
  });

  test('renders items table correctly using data-testid', () => {
    render(<InvoicePreviewComponent company={testCompany} recipient={testRecipient} items={testItems} date={testDate} />);

    expect(screen.getByTestId('preview-items-table')).toBeInTheDocument();

    // Check item descriptions
    expect(screen.getByTestId('preview-item-description-item-1')).toHaveTextContent('Service A');
    expect(screen.getByTestId('preview-item-description-item-2')).toHaveTextContent('Service B');

    // Check item amounts
    expect(screen.getByTestId('preview-item-amount-item-1')).toHaveTextContent('$100.00');
    expect(screen.getByTestId('preview-item-amount-item-2')).toHaveTextContent('$200.00');
  });

  test('calculates and renders item totals and overall total correctly using data-testid', () => {
    render(<InvoicePreviewComponent company={testCompany} recipient={testRecipient} items={testItems} date={testDate} />);

    // Check item totals using data-testid
    // Item 1: 100 * 1 + 0 = 100
    expect(screen.getByTestId('preview-item-total-item-1')).toHaveTextContent('$100.00');
    // Item 2: 200 * 1.5 + 50 = 350
    expect(screen.getByTestId('preview-item-total-item-2')).toHaveTextContent('$350.00');

    // Check overall total using data-testid
    // Overall: 100 + 350 = 450
    expect(screen.getByTestId('preview-overall-total')).toHaveTextContent('$450.00');
  });

  test('renders invoice number and date correctly when provided', () => {
    const invoiceNo = 'INV-TEST-123';
    const expectedDate = moment(testDate).format('MMMM D, YYYY'); // Format the test date

    render(<InvoicePreviewComponent company={testCompany} recipient={testRecipient} items={testItems} invoiceNo={invoiceNo} date={testDate} />);

    expect(screen.getByTestId('preview-invoice-no')).toHaveTextContent(`Invoice No: ${invoiceNo}`);
    expect(screen.getByTestId('preview-invoice-date')).toHaveTextContent(`Date: ${expectedDate}`);
  });

  test('renders default invoice number and current date when invoiceNo is not provided', () => {
    const expectedDate = moment(testDate).format('MMMM D, YYYY'); // Format the test date

    render(<InvoicePreviewComponent company={testCompany} recipient={testRecipient} items={testItems} date={testDate} />);

    // Check for default invoice number placeholder
    expect(screen.getByTestId('preview-invoice-no')).toHaveTextContent('Invoice No: INV-XXXX-XXX');
    // Check for the formatted date
    expect(screen.getByTestId('preview-invoice-date')).toHaveTextContent(`Date: ${expectedDate}`);
  });
});

