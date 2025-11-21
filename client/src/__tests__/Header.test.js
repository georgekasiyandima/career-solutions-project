import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// Mock only useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;
    // Mock the scroll event listener to manually trigger the handler
    window.addEventListener.mockImplementation((event, handler) => {
      if (event === 'scroll') {
        window.scrollHandler = handler; // Store the handler to call it manually
      }
    });
  });

  test('renders logo and hamburger menu', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Career Solutions Logo')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
  });

  test('toggles mobile menu visibility', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    const toggleButton = screen.getByLabelText('Toggle mobile menu');
    expect(screen.getByRole('navigation')).toHaveClass('hidden'); // Check navigation role

    fireEvent.click(toggleButton);
    expect(screen.getByRole('navigation')).not.toHaveClass('hidden');

    fireEvent.click(toggleButton);
    expect(screen.getByRole('navigation')).toHaveClass('hidden');
  });

  test('renders navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Schedule a Call')).toBeInTheDocument();
  });

  test('applies active class to current page link', () => {
    render(
      <MemoryRouter initialEntries={['/services']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    const servicesLink = screen.getByText('Services');
    expect(servicesLink).toHaveClass('text-brandGreen-default');
    expect(screen.getByText('Home')).not.toHaveClass('text-brandGreen-default');
  });

  test('changes header background on scroll', async () => {
    const { rerender } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toHaveClass('bg-transparent');

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 11 });
      // Manually trigger the scroll handler since fireEvent.scroll may not work in JSDOM
      if (window.scrollHandler) {
        window.scrollHandler(); // Call the handler directly
      } else {
        fireEvent.scroll(window); // Fallback to fireEvent
      }

      // Rerender to ensure the component reflects the updated state
      rerender(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Header />
        </MemoryRouter>
      );
    });

    // Use waitFor to ensure the DOM updates after the state change
    await waitFor(() => {
      expect(screen.getByRole('banner')).toHaveClass('bg-brandDarkTeal shadow-deep');
    }, { timeout: 1000 });
  });

  test('navigates to enquiry on schedule a call click', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    );
    const callButton = screen.getByText('Schedule a Call');
    fireEvent.click(callButton);
    expect(mockNavigate).toHaveBeenCalledWith('/enquiry');
  });
});