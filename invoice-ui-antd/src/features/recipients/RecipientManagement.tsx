import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RecipientProfile } from '../../types/invoice'; // Corrected path
import RecipientFormComponent from '../../components/forms/RecipientForm'; // Import the modal form
import { dummyRecipientProfiles } from '../../data/dummyData'; // Use dummy data for now
import { v4 as uuidv4 } from 'uuid';

const RecipientManagement: React.FC = () => {
  const [recipients, setRecipients] = useState<RecipientProfile[]>(dummyRecipientProfiles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<RecipientProfile | null>(null);

  // In a real app, fetch recipients here
  // useEffect(() => {
  //   // Fetch recipients data
  // }, []);

  const showAddModal = () => {
    setEditingRecipient(null);
    setIsModalVisible(true);
  };

  const showEditModal = (recipient: RecipientProfile) => {
    setEditingRecipient(recipient);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecipient(null);
  };

  const handleSave = (recipient: RecipientProfile) => {
    if (editingRecipient) {
      // Update existing recipient
      setRecipients(recipients.map(r => r.id === recipient.id ? recipient : r));
      message.success('Recipient updated successfully');
    } else {
      // Add new recipient
      const newRecipient = { ...recipient, id: uuidv4() }; // Ensure new ID
      setRecipients([...recipients, newRecipient]);
      message.success('Recipient added successfully');
    }
    setIsModalVisible(false);
    setEditingRecipient(null);
  };

  const handleDelete = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
    message.success('Recipient deleted successfully');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'VAT',
      dataIndex: 'vat',
      key: 'vat',
    },
    {
        title: 'Reg No',
        dataIndex: 'regNo',
        key: 'regNo',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: RecipientProfile) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} data-testid={`edit-recipient-${record.id}`}>Edit</Button>
          <Popconfirm
            title="Are you sure delete this recipient?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} data-testid={`delete-recipient-${record.id}`}>Delete</Button>
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
        data-testid="add-recipient-button"
      >
        Add Recipient
      </Button>
      <Table columns={columns} dataSource={recipients} rowKey="id" data-testid="recipients-table" />
      <RecipientFormComponent
        visible={isModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
        initialData={editingRecipient}
      />
    </div>
  );
};

export default RecipientManagement;

