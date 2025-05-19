import { render, screen } from '@testing-library/react';
import Home from './page';

it('renders Deploy now link', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: /deploy now/i })).toBeInTheDocument();
});
