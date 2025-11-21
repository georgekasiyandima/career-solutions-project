import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('HeroSection', () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders sea jobs section with correct heading', () => {
    render(<HeroSection />);
    expect(screen.getByText('Launch Your Cruise Ship Career')).toBeInTheDocument();
  });

  test('renders land jobs section with correct heading', () => {
    render(<HeroSection />);
    expect(screen.getByText('Land Your Dream Job Overseas')).toBeInTheDocument();
  });

  test('get started button for sea jobs is present', () => {
    render(<HeroSection />);
    const seaJobsButton = screen.getByRole('button', { name: 'Get Started with Cruise Ship Job Application' });
    expect(seaJobsButton).toBeInTheDocument();
  });
});