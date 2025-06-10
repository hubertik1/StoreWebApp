import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

test('hides delete button when not admin', () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  render(<ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin={false} />);
  expect(screen.queryByRole('button', { name: /Usuń/i })).toBeNull();
});

test('shows delete button for admin', () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  render(<ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin />);
  expect(screen.getByRole('button', { name: /Usuń/i })).toBeInTheDocument();
});

