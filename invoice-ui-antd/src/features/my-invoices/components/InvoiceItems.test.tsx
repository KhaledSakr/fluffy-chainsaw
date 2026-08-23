import React from 'react';
// Import custom render and other utilities from test-utils
import { render, screen, fireEvent, within, act } from '../../../test-utils/test-utils';
import '@testing-library/jest-dom';
import InvoiceItemsComponent from './InvoiceItems';
import { InvoiceItem } from '../../../types/invoice'; // Updated path
import { v4 as uuidv4 } from 'uuid';

// Mocks for antd message and uuid are now handled globally in test-utils

describe('InvoiceItemsComponent', () => {
  const mockOnItemsChange = jest.fn<void, [InvoiceItem[]]>();
  let uuidCounter = 0;

  beforeEach(() => {
    mockOnItemsChange.mockClear();
    // Reset mock implementation for uuid
    uuidCounter = 0;
    (uuidv4 as jest.Mock).mockImplementation(() => `mock-uuid-${++uuidCounter}`);
  });

  const initialItems: InvoiceItem[] = [
    { id: 'item-1', description: 'Service A', amount: 100 },
    { id: 'item-2', description: 'Service B', amount: 200, rate: 1.2, additional: 50 },
  ];

  test('renders initial invoice items correctly using data-testid', () => {
    render(<InvoiceItemsComponent items={initialItems} onItemsChange={mockOnItemsChange} />);

    expect(screen.getByTestId('invoice-items-card')).toBeInTheDocument();
    expect(screen.getByTestId('invoice-items-table')).toBeInTheDocument();

    // Check if initial items are rendered using data-testid
    expect(screen.getByTestId('item-description-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-description-item-1')).toHaveValue('Service A');
    expect(screen.getByTestId('item-amount-item-1')).toHaveValue(100);

    expect(screen.getByTestId('item-description-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-description-item-2')).toHaveValue('Service B');
    expect(screen.getByTestId('item-amount-item-2')).toHaveValue(200);
    expect(screen.getByTestId('item-rate-item-2')).toHaveValue(1.2);
    expect(screen.getByTestId('item-additional-item-2')).toHaveValue(50);
  });

  test('adds a new empty item when Add Item button is clicked', () => {
    render(<InvoiceItemsComponent items={initialItems} onItemsChange={mockOnItemsChange} />);

    const addButton = screen.getByTestId('add-item-button');
    act(() => {
        fireEvent.click(addButton);
    });

    // Check if onItemsChange was called with the new item added
    expect(mockOnItemsChange).toHaveBeenCalledTimes(1);
    const expectedNewItem: InvoiceItem = {
      id: 'mock-uuid-1', // Based on mocked uuid
      description: '',
      amount: 0,
      rate: 1, // Check default value
      additional: 0, // Check default value
    };
    expect(mockOnItemsChange).toHaveBeenCalledWith([...initialItems, expectedNewItem]);

    // Assuming the component re-renders with the new items prop after change
    // Let's re-render with the expected state to check UI
    const updatedItems = [...initialItems, expectedNewItem];
    render(<InvoiceItemsComponent items={updatedItems} onItemsChange={mockOnItemsChange} />);

    // Check the new row using data-testid
    expect(screen.getByTestId('item-description-mock-uuid-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-description-mock-uuid-1')).toHaveValue('');
    expect(screen.getByTestId('item-amount-mock-uuid-1')).toHaveValue(0);
    expect(screen.getByTestId('item-rate-mock-uuid-1')).toHaveValue(1);
    expect(screen.getByTestId('item-additional-mock-uuid-1')).toHaveValue(0);
  });

  test('updates an item when its input field changes using data-testid', () => {
    render(<InvoiceItemsComponent items={initialItems} onItemsChange={mockOnItemsChange} />);

    act(() => {
        const descriptionInput = screen.getByTestId('item-description-item-1');
        fireEvent.change(descriptionInput, { target: { value: 'Updated Service A' } });
    });

    expect(mockOnItemsChange).toHaveBeenCalledTimes(1);
    expect(mockOnItemsChange).toHaveBeenCalledWith([
      { ...initialItems[0], description: 'Updated Service A' },
      initialItems[1],
    ]);

    // Test changing amount using data-testid
    act(() => {
        const amountInput = screen.getByTestId('item-amount-item-1');
        // InputNumber might need different event or value handling in tests
        fireEvent.change(amountInput, { target: { value: '150' } });
    });

    expect(mockOnItemsChange).toHaveBeenCalledTimes(2);
    // The value passed might be string or number depending on Antd InputNumber implementation detail
    // Let's assume the component handles parsing correctly
    expect(mockOnItemsChange).toHaveBeenCalledWith([
      { ...initialItems[0], description: 'Updated Service A', amount: 150 },
      initialItems[1],
    ]);

    // Test changing rate using data-testid
    act(() => {
        const rateInput = screen.getByTestId('item-rate-item-2');
        fireEvent.change(rateInput, { target: { value: '1.5' } });
    });

    expect(mockOnItemsChange).toHaveBeenCalledTimes(3);
    expect(mockOnItemsChange).toHaveBeenCalledWith([
        { ...initialItems[0], description: 'Updated Service A', amount: 150 },
        { ...initialItems[1], rate: 1.5 },
    ]);
  });

  test('removes an item when its delete button is clicked using data-testid', () => {
    render(<InvoiceItemsComponent items={initialItems} onItemsChange={mockOnItemsChange} />);

    const deleteButton = screen.getByTestId('delete-item-item-1');

    // Click the delete button (which triggers Popconfirm)
    act(() => {
        fireEvent.click(deleteButton);
    });

    // Find and click the confirm button in the Popconfirm overlay
    // Popconfirm content is usually rendered in a portal, need to search document body
    const confirmButton = screen.getByRole('button', { name: /Yes/i });
    act(() => {
        fireEvent.click(confirmButton);
    });

    expect(mockOnItemsChange).toHaveBeenCalledTimes(1);
    // Called with only the second item remaining
    expect(mockOnItemsChange).toHaveBeenCalledWith([initialItems[1]]);
  });
});

