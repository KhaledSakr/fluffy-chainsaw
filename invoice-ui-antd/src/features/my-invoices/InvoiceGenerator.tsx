import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Select, Collapse, message, Space, Typography } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'; // Added PlusOutlined
import { CompanyProfile, RecipientProfile, InvoiceItem, Invoice } from '../../types/invoice';
import CompanyProfileComponent from './components/CompanyProfile';
import InvoiceItemsComponent from './components/InvoiceItems';
import RecipientForm from '../../components/forms/RecipientForm'; // Import shared form
import { dummyCompanyProfile } from '../../data/dummyData'; // Only need company profile default
import { v4 as uuidv4 } from 'uuid';

const { Panel } = Collapse;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface InvoiceGeneratorProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (invoice: Invoice, newRecipient?: RecipientProfile) => void; // Modified to potentially pass back new recipient
  initialData?: Invoice | null;
  availableRecipients: RecipientProfile[];
  onRecipientAdded: (newRecipient: RecipientProfile) => void; // Callback to update parent's recipient list
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ visible, onCancel, onSave, initialData, availableRecipients, onRecipientAdded }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(dummyCompanyProfile);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientProfile | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isAddRecipientModalVisible, setIsAddRecipientModalVisible] = useState(false); // State for Add Recipient modal
  const isEditing = !!initialData;

  useEffect(() => {
    if (visible) {
      if (isEditing && initialData) {
        setSelectedRecipient(initialData.recipient);
        setItems(initialData.items);
        setCompanyProfile(initialData.company);
      } else {
        setSelectedRecipient(null);
        setItems([]);
        setCompanyProfile(dummyCompanyProfile);
      }
    }
  }, [visible, initialData, isEditing]);

  const handleRecipientChange = (recipientId: string) => {
    const recipient = availableRecipients.find(r => r.id === recipientId) || null;
    setSelectedRecipient(recipient);
  };

  const handleItemsChange = (updatedItems: InvoiceItem[]) => {
    setItems(updatedItems);
  };

  const showAddRecipientModal = () => {
    setIsAddRecipientModalVisible(true);
  };

  const handleAddRecipientCancel = () => {
    setIsAddRecipientModalVisible(false);
  };

  const handleAddRecipientSave = (newRecipient: RecipientProfile) => {
    // Call the callback passed from the parent to update the main list
    onRecipientAdded(newRecipient);
    // Optionally select the newly added recipient
    setSelectedRecipient(newRecipient);
    setIsAddRecipientModalVisible(false);
    message.success('New recipient added successfully!');
  };

  const handleSaveInvoice = () => {
    if (!selectedRecipient) {
      message.error('Please select or add a recipient.');
      return;
    }
    if (items.length === 0) {
      message.error('Please add at least one invoice item.');
      return;
    }

    const invoiceData: Invoice = {
      id: initialData?.id || uuidv4(),
      invoiceNo: initialData?.invoiceNo || `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: initialData?.date || new Date().toISOString(),
      company: companyProfile,
      recipient: selectedRecipient,
      items: items,
    };

    onSave(invoiceData);
    // onCancel(); // Keep modal open? Or close? User might want to generate another. Let's close for now.
  };

  return (
    <>
      <Modal
        title={isEditing ? 'Edit Invoice' : 'Create New Invoice'}
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel} data-testid="invoice-modal-cancel-button">
            Cancel
          </Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSaveInvoice} data-testid="invoice-modal-save-button">
            {isEditing ? 'Update Invoice' : 'Save Invoice'}
          </Button>,
        ]}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
        data-testid="invoice-generator-modal"
      >
        <Row gutter={24}>
          {/* Left Column */}
          <Col xs={24} md={10}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Company Profile Section */}
              <Collapse defaultActiveKey={[]} data-testid="company-info-collapse">
                <Panel header={<Title level={5}>Company Information (Read-Only)</Title>} key="1">
                  <CompanyProfileComponent profile={companyProfile} onProfileChange={() => {}} readOnly={true} />
                </Panel>
              </Collapse>

              {/* Recipient Selection Section */}
              <div data-testid="recipient-selection-section">
                <Title level={5}>Recipient</Title>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select or search for a recipient"
                  optionFilterProp="children"
                  onChange={handleRecipientChange}
                  value={selectedRecipient?.id}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  data-testid="recipient-select"
                >
                  {availableRecipients.map(recipient => (
                    <Option key={recipient.id} value={recipient.id} data-testid={`recipient-option-${recipient.id}`}>
                      {recipient.name}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={showAddRecipientModal}
                  style={{ width: '100%', marginTop: '10px' }}
                  data-testid="add-new-recipient-button"
                >
                  Add New Recipient
                </Button>
                {selectedRecipient && (
                  <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '4px' }} data-testid="selected-recipient-details">
                    <Text strong>{selectedRecipient.name}</Text>
                    <Paragraph>{selectedRecipient.address}</Paragraph>
                    <Text>VAT: {selectedRecipient.vat}</Text><br/>
                    <Text>Reg No: {selectedRecipient.regNo}</Text>
                  </div>
                )}
              </div>
            </Space>
          </Col>

          {/* Right Column */}
          <Col xs={24} md={14}>
            <InvoiceItemsComponent items={items} onItemsChange={handleItemsChange} />
          </Col>
        </Row>
      </Modal>

      {/* Add Recipient Modal */}
      <Modal
        title="Add New Recipient"
        open={isAddRecipientModalVisible}
        onCancel={handleAddRecipientCancel}
        footer={null} // Footer handled by RecipientForm
        destroyOnClose
        data-testid="add-recipient-modal"
      >
        <RecipientForm
          visible={isAddRecipientModalVisible} // Pass the visibility state
          onSave={handleAddRecipientSave}
          onCancel={handleAddRecipientCancel}
          // No initial data for adding
        />
      </Modal>
    </>
  );
};

export default InvoiceGenerator;

