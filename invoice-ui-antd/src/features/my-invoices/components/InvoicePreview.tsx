import React from 'react';
import { Card, Row, Col, Typography, Table, Divider } from 'antd';
import { CompanyProfile, RecipientProfile, InvoiceItem } from '../../../types/invoice'; // Adjusted path
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

interface InvoicePreviewProps {
  company: CompanyProfile;
  recipient: RecipientProfile;
  items: InvoiceItem[];
  invoiceNo?: string;
  date: string; // Added date prop
}

const InvoicePreviewComponent: React.FC<InvoicePreviewProps> = ({ company, recipient, items, invoiceNo, date }) => {
  const calculateItemTotal = (item: InvoiceItem): number => {
    const rate = item.rate === undefined ? 1 : item.rate;
    const additional = item.additional === undefined ? 0 : item.additional;
    return item.amount * rate + additional;
  };

  const overallTotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  // Format the passed invoice date instead of current date
  const formattedInvoiceDate = moment(date).format('MMMM D, YYYY');

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: InvoiceItem) => <span data-testid={`preview-item-description-${record.id}`}>{text}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (text: number, record: InvoiceItem) => <span data-testid={`preview-item-amount-${record.id}`}>{`$${text.toFixed(2)}`}</span>,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      align: 'right' as const,
      render: (text: number | undefined, record: InvoiceItem) => <span data-testid={`preview-item-rate-${record.id}`}>{text === undefined ? '1.00' : text.toFixed(2)}</span>,
    },
    {
      title: 'Additional',
      dataIndex: 'additional',
      key: 'additional',
      align: 'right' as const,
      render: (text: number | undefined, record: InvoiceItem) => <span data-testid={`preview-item-additional-${record.id}`}>{`$${(text === undefined ? 0 : text).toFixed(2)}`}</span>,
    },
    {
      title: 'Total Item',
      key: 'totalItem',
      align: 'right' as const,
      render: (_: any, record: InvoiceItem) => (
        <Text strong data-testid={`preview-item-total-${record.id}`}>{`$${calculateItemTotal(record).toFixed(2)}`}</Text>
      ),
    },
  ];

  return (
    <Card title={<Title level={5}>Invoice Preview</Title>} bordered={false} data-testid="invoice-preview-card">
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col data-testid="preview-company-name">
          <Title level={4}>{company.companyName}</Title>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <Text strong data-testid="preview-invoice-label">Invoice</Text>
          <Paragraph data-testid="preview-invoice-no">Invoice No: {invoiceNo || 'INV-XXXX-XXX'}</Paragraph>
          {/* Use formatted invoice date */}
          <Paragraph data-testid="preview-invoice-date">Date: {formattedInvoiceDate}</Paragraph>
        </Col>
      </Row>

      <Divider />

      {/* Company and Recipient Details */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12} data-testid="preview-company-details">
          <Text strong>From:</Text>
          <Paragraph>{company.companyName}</Paragraph>
          <Paragraph>{company.companyAddress}</Paragraph>
          <Paragraph>VAT: {company.companyVat}</Paragraph>
          <Paragraph>Reg No: {company.companyRegNo}</Paragraph>
        </Col>
        <Col span={12} data-testid="preview-recipient-details">
          <Text strong>To:</Text>
          <Paragraph>{recipient.name}</Paragraph>
          <Paragraph>{recipient.address}</Paragraph>
          <Paragraph>VAT: {recipient.vat}</Paragraph>
          <Paragraph>Reg No: {recipient.regNo}</Paragraph>
        </Col>
      </Row>

      {/* Items Table */}
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        bordered
        data-testid="preview-items-table"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4} align="right">
              <Text strong>Total:</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text strong data-testid="preview-overall-total">{`$${overallTotal.toFixed(2)}`}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Divider />

      {/* Bank Details */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24} data-testid="preview-bank-details">
          <Text strong>Bank Details:</Text>
          <Paragraph>Bank: {company.companyBankName}</Paragraph>
          <Paragraph>IBAN: {company.companyBankIban}</Paragraph>
          <Paragraph>SWIFT/BIC: {company.companyBankSwift}</Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default InvoicePreviewComponent;

