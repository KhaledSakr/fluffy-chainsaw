import React from 'react';
// Import custom render and other utilities from test-utils
import { render, screen, fireEvent, waitFor, act } from '../../../test-utils/test-utils';
import '@testing-library/jest-dom';
import RecipientFormComponent from './RecipientForm';
import { dummyRecipientProfiles } from '../../../data/dummyData'; // Adjusted path
import { RecipientProfile } from '../../../types/invoice'; // Adjusted path

// Mocks for antd message and uuid are now handled globally in test-utils

describe('RecipientFormComponent (Modal)', () => {
  const mockOnSave = jest.fn<void, [RecipientProfile]>();
  const mockOnCancel = jest.fn();
  const existingRecipient = dummyRecipientProfiles[0];

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
    // Reset message mocks if needed (though handled globally)
    const message = require('antd').message;
    message.success.mockClear();
    message.error.mockClear();
    // Reset uuid mock if needed (though handled globally)
    (require('uuid').v4 as jest.Mock).mockClear().mockImplementation(() => 'mock-uuid-recipient');
  });

  // Removed renderComponent helper, using custom render directly

  test('renders modal with form fields for adding a new recipient when visible=true', () => {
    render(<RecipientFormComponent visible={true} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByTestId('recipient-form-modal')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-address-input')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-vat-input')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-skip-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-form-ok-button')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-form-cancel-button')).toBeInTheDocument();
  });

  test('renders modal with form fields pre-filled for editing when visible=true and initialData provided', () => {
    render(<RecipientFormComponent visible={true} initialData={existingRecipient} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByTestId('recipient-form-modal')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-name-input')).toHaveValue(existingRecipient.name);
    expect(screen.getByTestId('recipient-address-input')).toHaveValue(existingRecipient.address);
    expect(screen.getByTestId('recipient-vat-input')).toHaveValue(existingRecipient.vat);
    if (existingRecipient.skip !== undefined && existingRecipient.skip) {
      expect(screen.getByTestId('recipient-skip-checkbox')).toBeChecked();
    } else {
      expect(screen.getByTestId('recipient-skip-checkbox')).not.toBeChecked();
    }
    expect(screen.getByTestId('recipient-form-ok-button')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-form-cancel-button')).toBeInTheDocument();
  });

  test('calls onSave with new recipient data when adding via modal', async () => {
    render(<RecipientFormComponent visible={true} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const message = require('antd').message;

    // Wrap state updates in act
    await act(async () => {
        fireEvent.change(screen.getByTestId('recipient-name-input'), { target: { value: 'New Modal Recipient' } });
        fireEvent.change(screen.getByTestId('recipient-address-input'), { target: { value: '456 Modal St' } });
        fireEvent.change(screen.getByTestId('recipient-vat-input'), { target: { value: 'MODALVAT456' } });
        fireEvent.change(screen.getByTestId('recipient-regno-input'), { target: { value: 'MODALREG654' } });
        fireEvent.change(screen.getByTestId('recipient-iban-input'), { target: { value: 'MODALIBAN456' } });
        fireEvent.change(screen.getByTestId('recipient-swift-input'), { target: { value: 'MODALSWIFT' } });
        fireEvent.click(screen.getByTestId('recipient-skip-checkbox'));
    });

    // Wrap the final action causing state updates in act
    await act(async () => {
        fireEvent.click(screen.getByTestId('recipient-form-ok-button'));
    });

    // Wait for assertions
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Modal Recipient',
      address: '456 Modal St',
      vat: 'MODALVAT456',
      id: 'mock-uuid-recipient',
      items: [],
      skip: true,
    }));
    expect(message.success).toHaveBeenCalledWith('Recipient added successfully!');
  });

  test('calls onSave with updated recipient data when editing via modal', async () => {
    render(<RecipientFormComponent visible={true} initialData={existingRecipient} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const message = require('antd').message;

    await act(async () => {
        fireEvent.change(screen.getByTestId('recipient-name-input'), { target: { value: 'Updated Modal Name' } });
        if (existingRecipient.skip) {
          fireEvent.click(screen.getByTestId('recipient-skip-checkbox'));
        }
    });

    await act(async () => {
        fireEvent.click(screen.getByTestId('recipient-form-ok-button'));
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      ...existingRecipient,
      name: 'Updated Modal Name',
      skip: false,
    }));
    expect(message.success).toHaveBeenCalledWith('Recipient updated successfully!');
  });

  test('calls onCancel when modal Cancel button is clicked', () => {
    render(<RecipientFormComponent visible={true} onSave={mockOnSave} onCancel={mockOnCancel} />);

    act(() => {
        fireEvent.click(screen.getByTestId('recipient-form-cancel-button'));
    });

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('shows validation error if required fields are empty on modal submit', async () => {
    render(<RecipientFormComponent visible={true} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const message = require('antd').message;

    await act(async () => {
        fireEvent.click(screen.getByTestId('recipient-form-ok-button'));
    });

    // Wait for the error message
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to save recipient. Please check the form.');
    });

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test('does not render modal content when visible=false', () => {
    render(<RecipientFormComponent visible={false} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.queryByTestId('recipient-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recipient-name-input')).not.toBeInTheDocument();
  });

});

