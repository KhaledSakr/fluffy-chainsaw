import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { CompanyProfile } from '../../types/invoice';
import { dummyCompanyProfile } from '../../data/dummyData'; // Using dummy data for now

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(dummyCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, fetch company profile from API or localStorage
    // For now, we use dummy data and set the form fields
    form.setFieldsValue(companyProfile);
  }, [companyProfile, form]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form to current profile when entering edit mode
      form.setFieldsValue(companyProfile);
    }
  };

  const onFinish = (values: CompanyProfile) => {
    console.log('Saving profile:', values);
    // TODO: Implement saving logic (e.g., API call, update localStorage)
    setCompanyProfile(values);
    setIsEditing(false);
    message.success('Profile updated successfully!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Failed to update profile. Please check the form.');
  };

  return (
    <Card title={<Title level={4}>Company Profile</Title>}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        disabled={!isEditing}
      >
        <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please input the company name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="companyAddress" rules={[{ required: true, message: 'Please input the company address!' }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="VAT Number" name="companyVat" rules={[{ required: true, message: 'Please input the VAT number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Registration Number" name="companyRegNo" rules={[{ required: true, message: 'Please input the registration number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Bank Name" name="companyBankName" rules={[{ required: true, message: 'Please input the bank name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="IBAN" name="companyBankIban" rules={[{ required: true, message: 'Please input the IBAN!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="SWIFT/BIC" name="companyBankSwift" rules={[{ required: true, message: 'Please input the SWIFT/BIC code!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Short Name (for backend)" name="companyShortName">
          <Input placeholder="Optional: Used for directory naming" />
        </Form.Item>

        <Form.Item>
          {isEditing ? (
            <Space>
              <Button type="primary" htmlType="submit">
                Save Profile
              </Button>
              <Button onClick={handleEditToggle}>Cancel</Button>
            </Space>
          ) : (
            <Button type="primary" onClick={handleEditToggle}>
              Edit Profile
            </Button>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserProfile;

