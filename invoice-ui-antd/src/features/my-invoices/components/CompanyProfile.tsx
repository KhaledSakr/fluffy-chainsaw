import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { CompanyProfile } from '../../../types/invoice'; // Adjusted path

const { Title } = Typography;

interface CompanyProfileProps {
  profile: CompanyProfile;
  onProfileChange: (profile: CompanyProfile) => void;
  readOnly?: boolean; // Added readOnly prop
}

const CompanyProfileComponent: React.FC<CompanyProfileProps> = ({ profile, onProfileChange, readOnly = false }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Update form fields when profile prop changes or when entering/exiting edit mode
    form.setFieldsValue(profile);
  }, [profile, form, isEditing]); // Depend on isEditing to reset form on cancel

  const handleEditToggle = () => {
    if (!readOnly) {
      setIsEditing(!isEditing);
      // No need to reset form here, useEffect handles it based on isEditing
    }
  };

  const onFinish = async (values: CompanyProfile) => {
    try {
      // Ensure all required fields are validated (Antd form does this)
      console.log('Saving profile:', values);
      onProfileChange(values); // Call the callback with updated data
      setIsEditing(false);
      message.success('Company profile updated successfully!');
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      message.error('Failed to update profile. Please check the form.');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Failed to update profile. Please check the form.');
  };

  return (
    <Card title={<Title level={4}>Company Profile</Title>} data-testid="company-profile-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        disabled={!isEditing && !readOnly} // Disable form if not editing AND not readOnly
        initialValues={profile} // Set initial values for the form
      >
        <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please input the company name!' }]}>
          <Input data-testid="company-name-input" />
        </Form.Item>
        <Form.Item label="Address" name="companyAddress" rules={[{ required: true, message: 'Please input the company address!' }]}>
          <Input.TextArea rows={3} data-testid="company-address-input" />
        </Form.Item>
        <Form.Item label="VAT Number" name="companyVat" rules={[{ required: true, message: 'Please input the VAT number!' }]}>
          <Input data-testid="company-vat-input" />
        </Form.Item>
        <Form.Item label="Registration Number" name="companyRegNo" rules={[{ required: true, message: 'Please input the registration number!' }]}>
          <Input data-testid="company-regno-input" />
        </Form.Item>
        <Form.Item label="Bank Name" name="companyBankName" rules={[{ required: true, message: 'Please input the bank name!' }]}>
          <Input data-testid="company-bankname-input" />
        </Form.Item>
        <Form.Item label="IBAN" name="companyBankIban" rules={[{ required: true, message: 'Please input the IBAN!' }]}>
          <Input data-testid="company-iban-input" />
        </Form.Item>
        <Form.Item label="SWIFT/BIC" name="companyBankSwift" rules={[{ required: true, message: 'Please input the SWIFT/BIC code!' }]}>
          <Input data-testid="company-swift-input" />
        </Form.Item>
        <Form.Item label="Short Name (for backend)" name="companyShortName">
          <Input placeholder="Optional: Used for directory naming" data-testid="company-shortname-input" />
        </Form.Item>

        {!readOnly && (
          <Form.Item>
            {isEditing ? (
              <Space>
                <Button type="primary" htmlType="submit" data-testid="save-profile-button">
                  Save Profile
                </Button>
                <Button onClick={handleEditToggle} data-testid="cancel-edit-profile-button">Cancel</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={handleEditToggle} data-testid="edit-profile-button">
                Edit Profile
              </Button>
            )}
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default CompanyProfileComponent;

