import { render, screen } from '@testing-library/react';
import App from './App';

test('renders store header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Sklep Wszystko i Nic/i });
  expect(headerElement).toBeInTheDocument();

  const manageButton = screen.getByRole('button', { name: /Manage Products/i });
  expect(manageButton).toBeInTheDocument();
});
