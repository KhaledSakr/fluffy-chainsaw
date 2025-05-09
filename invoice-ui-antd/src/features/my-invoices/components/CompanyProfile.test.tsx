import React from 'react';
// Import custom render and other utilities from test-utils
import { render, screen, fireEvent, waitFor, act } from '../../../test-utils/test-utils';
import '@testing-library/jest-dom';
import CompanyProfileComponent from './CompanyProfile';
import { dummyCompanyProfile } from '../../../data/dummyData'; // Updated path
import { CompanyProfile } from '../../../types/invoice'; // Updated path

// Mocks for antd message and uuid are now handled globally in test-utils

describe('CompanyProfileComponent', () => {
  // Use the specific type for the mock function
  const mockOnProfileChange = jest.fn<void, [CompanyProfile]>();

  beforeEach(() => {
    // Clear mock calls before each test
    mockOnProfileChange.mockClear();
    // Reset message mocks if needed (though handled globally)
    const message = require('antd').message;
    message.success.mockClear();
    message.error.mockClear();
  });

  test('renders company profile information in read-only state when readOnly is true', () => {
    render(<CompanyProfileComponent profile={dummyCompanyProfile} onProfileChange={mockOnProfileChange} readOnly={true} />);

    // Check if the card is rendered
    expect(screen.getByTestId('company-profile-card')).toBeInTheDocument();

    // Check if form fields are rendered and disabled using data-testid
    const nameInput = screen.getByTestId('company-name-input');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeDisabled();
    expect(nameInput).toHaveValue(dummyCompanyProfile.companyName);

    const addressInput = screen.getByTestId('company-address-input');
    expect(addressInput).toBeInTheDocument();
    expect(addressInput).toBeDisabled();

    // Check that Edit/Save/Cancel buttons are NOT present in readOnly mode
    expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('save-profile-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cancel-edit-profile-button')).not.toBeInTheDocument();
  });

  test('renders company profile information with edit controls when readOnly is false or undefined', () => {
    render(<CompanyProfileComponent profile={dummyCompanyProfile} onProfileChange={mockOnProfileChange} />); // readOnly defaults to false

    // Check if form fields are rendered and disabled initially
    expect(screen.getByTestId('company-name-input')).toBeDisabled();

    // Check if Edit button is present
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.queryByTestId('save-profile-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cancel-edit-profile-button')).not.toBeInTheDocument();
  });

  test('enables editing when Edit Profile button is clicked (readOnly=false)', () => {
    render(<CompanyProfileComponent profile={dummyCompanyProfile} onProfileChange={mockOnProfileChange} />);

    const editButton = screen.getByTestId('edit-profile-button');
    act(() => {
        fireEvent.click(editButton);
    });

    // Check if form fields are now enabled
    expect(screen.getByTestId('company-name-input')).toBeEnabled();
    expect(screen.getByTestId('company-address-input')).toBeEnabled();

    // Check if Save and Cancel buttons are present
    expect(screen.getByTestId('save-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-edit-profile-button')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-profile-button')).not.toBeInTheDocument();
  });

  test('calls onProfileChange with updated data when Save button is clicked after editing', async () => {
    render(<CompanyProfileComponent profile={dummyCompanyProfile} onProfileChange={mockOnProfileChange} />);
    const message = require('antd').message;

    // Enter edit mode
    act(() => {
        fireEvent.click(screen.getByTestId('edit-profile-button'));
    });

    // Change a value
    await act(async () => {
        const nameInput = screen.getByTestId('company-name-input');
        fireEvent.change(nameInput, { target: { value: 'New Company Name' } });
    });

    // Click Save
    await act(async () => {
        const saveButton = screen.getByTestId('save-profile-button');
        fireEvent.click(saveButton);
    });

    // Wait for save to complete and return to view mode
    await waitFor(() => {
        expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    });

    expect(mockOnProfileChange).toHaveBeenCalledTimes(1);
    expect(mockOnProfileChange).toHaveBeenCalledWith(expect.objectContaining({ companyName: 'New Company Name' }));
    expect(message.success).toHaveBeenCalledWith('Company profile updated successfully!');

    // Check if back in view mode
    expect(screen.getByTestId('company-name-input')).toBeDisabled();
  });

   test('cancels editing and resets form when Cancel button is clicked', () => {
    render(<CompanyProfileComponent profile={dummyCompanyProfile} onProfileChange={mockOnProfileChange} />);

    // Enter edit mode
    act(() => {
        fireEvent.click(screen.getByTestId('edit-profile-button'));
    });

    // Change a value but don't save
    act(() => {
        const nameInput = screen.getByTestId('company-name-input');
        fireEvent.change(nameInput, { target: { value: 'Temporary Name Change' } });
        expect(nameInput).toHaveValue('Temporary Name Change');
    });

    // Click Cancel
    act(() => {
        const cancelButton = screen.getByTestId('cancel-edit-profile-button');
        fireEvent.click(cancelButton);
    });

    // Check if back in view mode and value is reset
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('company-name-input')).toBeDisabled();
    // Check if the value reverted to the initial profile value
    expect(screen.getByTestId('company-name-input')).toHaveValue(dummyCompanyProfile.companyName);
    expect(mockOnProfileChange).not.toHaveBeenCalled();
  });

});

