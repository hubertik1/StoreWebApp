import { render, screen } from '@testing-library/react';
import App from './App';

test('renders store header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Sklep Wszystko i Nic/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Szukaj produktu/i);
  expect(input).toBeInTheDocument();
});

test('renders pagination controls', () => {
  render(<App />);
  const nextButton = screen.getByRole('button', { name: />/i });
  expect(nextButton).toBeInTheDocument();
});

