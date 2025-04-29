import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h1 style={{ color: 'blue' }}>Hello from Test Component!</h1>
      <p>If you can see this, the basic React rendering is working.</p>
    </div>
  );
};

export default TestComponent;

