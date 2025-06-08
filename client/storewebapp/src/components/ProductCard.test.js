import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

test('renders delete button', () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  render(<ProductCard product={product} apiUrl="/" onDelete={() => {}} />);
  expect(screen.getByRole('button', { name: /Usuń/i })).toBeInTheDocument();
});

