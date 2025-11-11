import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';


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
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('renders AutoGuard dashboard', () => {
    const { container } = render(<App />);
   
    expect(container).not.toBeEmptyDOMElement();
  });
});
