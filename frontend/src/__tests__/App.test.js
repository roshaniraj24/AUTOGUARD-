import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock WebSocket
global.WebSocket = class WebSocket {
  constructor() {
    this.readyState = 1;
  }
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test('renders AutoGuard dashboard', () => {
    render(<App />);
    // Basic test that component renders
    expect(document.querySelector('.App')).toBeTruthy();
  });
});
