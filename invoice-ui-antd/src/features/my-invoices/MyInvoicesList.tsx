import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Invoice, RecipientProfile, InvoiceItem } from '../../types/invoice';
import InvoiceGenerator from './InvoiceGenerator';
import InvoicePreviewComponent from './components/InvoicePreview';
import { dummyInvoices, dummyRecipientProfiles } from '../../data/dummyData';
import { v4 as uuidv4 } from 'uuid';

const MyInvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(dummyInvoices);
  const [isGeneratorModalVisible, setIsGeneratorModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [availableRecipients, setAvailableRecipients] = useState<RecipientProfile[]>(dummyRecipientProfiles);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Function to handle adding a new recipient (passed to InvoiceGenerator)
  const handleRecipientAdded = (newRecipient: RecipientProfile) => {
    setAvailableRecipients(prev => [...prev, newRecipient]);
  };

  // Functions for Generator Modal
  const showAddModal = () => {
    setEditingInvoice(null);
    setIsGeneratorModalVisible(true);
  };

  const showEditModal = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsGeneratorModalVisible(true);
  };

  const handleGeneratorCancel = () => {
    setIsGeneratorModalVisible(false);
    setEditingInvoice(null);
  };

  // Note: onSave in InvoiceGenerator doesn't pass newRecipient, handled by onRecipientAdded
  const handleGeneratorSave = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      message.success('Invoice updated successfully');
    } else {
      const newInvoice = { ...invoice, id: uuidv4() };
      setInvoices([...invoices, newInvoice]);
      message.success('Invoice created successfully');
    }
    setIsGeneratorModalVisible(false);
    setEditingInvoice(null);
  };

  // Functions for Preview Modal
  const showPreviewModal = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setIsPreviewModalVisible(true);
  };

  const handlePreviewCancel = () => {
    setIsPreviewModalVisible(false);
    setViewingInvoice(null);
  };

  // Function for Deleting Invoice
  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    message.success('Invoice deleted successfully');
  };

  const columns = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Recipient',
      dataIndex: ['recipient', 'name'],
      key: 'recipientName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount',
      key: 'totalAmount',
      render: (_: any, record: Invoice) => {
        const total = record.items.reduce((sum: number, item: InvoiceItem) => sum + (item.amount * (item.rate || 1) + (item.additional || 0)), 0);
        return `$${total.toFixed(2)}`;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Invoice) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => showPreviewModal(record)} data-testid={`view-invoice-${record.id}`}>View</Button>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} data-testid={`edit-invoice-${record.id}`}>Edit</Button>
          <Popconfirm
            title="Are you sure delete this invoice?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} data-testid={`delete-invoice-${record.id}`}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddModal}
        style={{ marginBottom: 16 }}
        data-testid="create-new-invoice-button"
      >
        Create New Invoice
      </Button>
      <Table columns={columns} dataSource={invoices} rowKey="id" data-testid="invoices-table" />

      {/* Invoice Generator Modal */}
      <InvoiceGenerator
        visible={isGeneratorModalVisible}
        onCancel={handleGeneratorCancel}
        onSave={handleGeneratorSave}
        initialData={editingInvoice}
        availableRecipients={availableRecipients}
        onRecipientAdded={handleRecipientAdded} // Pass the callback here
      />

      {/* Invoice Preview Modal */}
      {viewingInvoice && (
        <Modal
          title={`Invoice Preview: ${viewingInvoice.invoiceNo}`}
          open={isPreviewModalVisible}
          onCancel={handlePreviewCancel}
          footer={[
            <Button key="close" onClick={handlePreviewCancel}>
              Close
            </Button>,
          ]}
          width="80%"
          destroyOnClose
          data-testid="invoice-preview-modal"
        >
          <InvoicePreviewComponent
            company={viewingInvoice.company}
            recipient={viewingInvoice.recipient}
            items={viewingInvoice.items}
            invoiceNo={viewingInvoice.invoiceNo}
            date={viewingInvoice.date}
          />
        </Modal>
      )}
    </div>
  );
};

export default MyInvoicesList;

