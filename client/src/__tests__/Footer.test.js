import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';

// Mock fetch and window.scrollTo
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Subscription successful' }),
  })
);
const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('renders links, newsletter form, and social icons', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit our Facebook page')).toBeInTheDocument();
  });

  test('submits newsletter form successfully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Subscription successful' }),
      })
    );

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Footer />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Subscribe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Subscription successful')).toBeInTheDocument();
    }, { timeout: 4000 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/subscriptions'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );
    expect(emailInput).toHaveValue('');
  });

  test('shows error for invalid email', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Footer />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Subscribe');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('scrolls to top on button click', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Footer />
      </MemoryRouter>
    );
    const scrollButton = screen.getByLabelText('Scroll back to top');
    fireEvent.click(scrollButton);
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});