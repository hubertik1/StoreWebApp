import { render, screen, act } from '@testing-library/react';
import ProductCard from './ProductCard';

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }));
});

test('hides delete button when not admin', async () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  await act(async () => {
    render(
      <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin={false} token={null} />
    );
  });
  expect(screen.queryByRole('button', { name: /Usuń/i })).toBeNull();
});

test('shows delete button for admin', async () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  await act(async () => {
    render(
      <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin token="x" />
    );
  });
  const btns = screen.getAllByRole('button', { name: /Usuń/i });
  expect(btns.length).toBeGreaterThan(0);
});

test('shows edit button only for admin', async () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  await act(async () => {
    render(
      <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin token="x" />
    );
  });
  expect(screen.getByRole('button', { name: /Edytuj/i })).toBeInTheDocument();
});

test('hides edit button for normal user', async () => {
  const product = { id: 1, title: 'Test', description: 'Desc' };
  await act(async () => {
    render(
      <ProductCard product={product} apiUrl="/" onDelete={() => {}} isAdmin={false} token={null} />
    );
  });
  expect(screen.queryByRole('button', { name: /Edytuj/i })).toBeNull();
});

