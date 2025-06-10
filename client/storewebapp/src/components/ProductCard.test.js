import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

test('hides delete button when not admin', () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  render(
    <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin={false} token={null} />
  );
  expect(screen.queryByRole('button', { name: /Usuń/i })).toBeNull();
});

test('shows delete button for admin', () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  render(
    <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin token="x" />
  );
  expect(screen.getByRole('button', { name: /Usuń/i })).toBeInTheDocument();
});

