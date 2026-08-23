import React from 'react';
import { Table, Input, Button, Popconfirm, InputNumber, Card, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { InvoiceItem } from '../../../types/invoice'; // Adjusted path
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

const InvoiceItemsComponent: React.FC<InvoiceItemsProps> = ({ items, onItemsChange }) => {

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      description: '',
      amount: 0,
      rate: 1, // Default rate to 1
      additional: 0, // Default additional to 0
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        // Ensure numeric fields are handled correctly
        if (field === 'amount' || field === 'rate' || field === 'additional') {
          const numericValue = parseFloat(value);
          return { ...item, [field]: isNaN(numericValue) ? 0 : numericValue };
        } else {
          return { ...item, [field]: value };
        }
      }
      return item;
    });
    onItemsChange(updatedItems);
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: InvoiceItem) => (
        <Input
          value={text}
          onChange={(e) => handleItemChange(record.id, 'description', e.target.value)}
          placeholder="Item description"
          data-testid={`item-description-${record.id}`}
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text: number, record: InvoiceItem) => (
        <InputNumber
          value={text}
          onChange={(value) => handleItemChange(record.id, 'amount', value)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          data-testid={`item-amount-${record.id}`}
        />
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      render: (text: number, record: InvoiceItem) => (
        <InputNumber
          value={text === undefined ? 1 : text} // Default to 1 if undefined
          onChange={(value) => handleItemChange(record.id, 'rate', value)}
          min={0}
          step={0.1}
          precision={2}
          style={{ width: '100%' }}
          data-testid={`item-rate-${record.id}`}
        />
      ),
    },
    {
      title: 'Additional',
      dataIndex: 'additional',
      key: 'additional',
      width: 120,
      render: (text: number, record: InvoiceItem) => (
        <InputNumber
          value={text === undefined ? 0 : text} // Default to 0 if undefined
          onChange={(value) => handleItemChange(record.id, 'additional', value)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          data-testid={`item-additional-${record.id}`}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: any, record: InvoiceItem) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => handleRemoveItem(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            data-testid={`delete-item-${record.id}`}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title={<Title level={5}>Invoice Items</Title>} data-testid="invoice-items-card">
      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        data-testid="invoice-items-table"
      />
      <Button
        type="dashed"
        onClick={handleAddItem}
        icon={<PlusOutlined />}
        style={{ width: '100%', marginTop: '16px' }}
        data-testid="add-item-button"
      >
        Add Item
      </Button>
    </Card>
  );
};

export default InvoiceItemsComponent;

