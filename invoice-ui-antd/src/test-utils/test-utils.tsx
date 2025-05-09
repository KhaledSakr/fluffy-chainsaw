import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ConfigProvider } from 'antd';

// Mock Ant Design components that might cause issues in Jest
// This ensures message is mocked globally for tests using this render function
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
    },
    // Mock Modal.method() if needed, though usually not required for standard Modal usage
    // Modal: {
    //   ...antd.Modal,
    //   confirm: jest.fn(),
    // },
  };
});

// Mock uuid globally for tests using this render function
jest.mock('uuid', () => ({
  v4: jest.fn(() => `mock-uuid-${Date.now()}-${Math.random()}`), // Default mock
}));


const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // You can wrap with more providers here if needed (e.g., Router, Redux Store)
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

