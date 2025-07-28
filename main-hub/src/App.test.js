import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the landing page header', () => {
  render(<App />);
  const headingElement = screen.getByText(/AIML-A SECTION 27 BATCH/i);
  expect(headingElement).toBeInTheDocument();
});
