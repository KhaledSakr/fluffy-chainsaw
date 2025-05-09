import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, message, Checkbox } from 'antd'; // Added Checkbox
import { RecipientProfile } from '../../../types/invoice'; // Adjusted path
import { v4 as uuidv4 } from 'uuid'; // Import uuid

interface RecipientFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (recipient: RecipientProfile) => void;
  initialData?: RecipientProfile | null; // Pass null for new, or existing data for edit
}

const RecipientFormComponent: React.FC<RecipientFormProps> = ({ visible, onCancel, onSave, initialData }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialData;

  useEffect(() => {
    if (visible) {
      if (isEditing) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
        form.setFieldsValue({ skip: false }); // Default skip to false for new recipients
      }
    }
  }, [visible, initialData, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const recipientData: RecipientProfile = {
        ...(initialData || {}),
        ...values,
        id: initialData?.id || uuidv4(), // Use uuid for new recipients
        items: initialData?.items || [],
        skip: values.skip || false, // Ensure skip is boolean
      };
      onSave(recipientData);
      // message is mocked in tests, safe to call
      message.success(`Recipient ${isEditing ? 'updated' : 'added'} successfully!`);
      onCancel(); // Close modal after save
    } catch (errorInfo) {
      console.error('Failed to save recipient:', errorInfo);
      message.error('Failed to save recipient. Please check the form.');
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Recipient Profile' : 'Add New Recipient'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditing ? 'Update' : 'Add'}
      cancelText="Cancel"
      destroyOnClose
      data-testid="recipient-form-modal"
      // forceRender // Removed forceRender prop
      okButtonProps={{ "data-testid": "recipient-form-ok-button" }} // Add testid to OK button
      cancelButtonProps={{ "data-testid": "recipient-form-cancel-button" }} // Add testid to Cancel button
    >
      <Form form={form} layout="vertical" name="recipientForm" data-testid="recipient-form">
        <Form.Item
          label="Recipient Name"
          name="name"
          rules={[{ required: true, message: 'Please input the recipient name!' }]}
        >
          <Input data-testid="recipient-name-input" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input.TextArea rows={3} data-testid="recipient-address-input" />
        </Form.Item>
        <Form.Item
          label="VAT Number"
          name="vat"
          rules={[{ required: true, message: 'Please input the VAT number!' }]}
        >
          <Input data-testid="recipient-vat-input" />
        </Form.Item>
        <Form.Item
          label="Registration Number"
          name="regNo"
          rules={[{ required: true, message: 'Please input the registration number!' }]}
        >
          <Input data-testid="recipient-regno-input" />
        </Form.Item>
        <Form.Item
          label="Bank Name (Optional, defaults to Recipient Name)"
          name="bankName"
        >
          <Input placeholder="Defaults to Recipient Name if left blank" data-testid="recipient-bankname-input" />
        </Form.Item>
        <Form.Item
          label="IBAN"
          name="bankIban"
          rules={[{ required: true, message: 'Please input the IBAN!' }]}
        >
          <Input data-testid="recipient-iban-input" />
        </Form.Item>
        <Form.Item
          label="SWIFT/BIC"
          name="bankSwift"
          rules={[{ required: true, message: 'Please input the SWIFT/BIC code!' }]}
        >
          <Input data-testid="recipient-swift-input" />
        </Form.Item>
        <Form.Item
          label="Invoice Index Override (Optional)"
          name="invoiceOverride"
        >
          <Input placeholder="e.g., 002 (defaults to 001)" data-testid="recipient-invoiceoverride-input" />
        </Form.Item>
        {/* Ensure the skip field exists in the original component before adding Checkbox */}
        {/* Assuming 'skip' was intended to be part of the form */}
        <Form.Item label="Skip Invoice Generation" name="skip" valuePropName="checked">
             <Checkbox data-testid="recipient-skip-checkbox" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecipientFormComponent;

