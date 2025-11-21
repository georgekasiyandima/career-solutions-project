import { render, screen } from '@testing-library/react';
import DidYouKnow from '../DidYouKnow'; // Correct path: DidYouKnow.jsx is in src/

// Mock framer-motion to handle animation props
jest.mock('framer-motion', () => {
  const MockMotionDiv = ({ children, ...props }) => {
    // Filter out animation props that shouldn't be passed to the DOM
    const { initial, whileInView, viewport, variants, ...rest } = props;
    return <div {...rest}>{children}</div>;
  };

  return {
    motion: {
      div: MockMotionDiv,
    },
  };
});

describe('DidYouKnow', () => {
  beforeEach(() => {
    render(<DidYouKnow />);
  });

  test('renders the fun fact section with correct content', () => {
    expect(screen.getByText('Did You Know?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Did you know? The largest cruise ship in the world, Icon of the Seas, can hold over 7,600 passengers and features a 140,000-gallon water park!'
      )
    ).toBeInTheDocument();
  });

  test('renders the cruise ship image with correct attributes', () => {
    const image = screen.getByAltText('Icon of the Seas Cruise Ship');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/Icon of the Seas.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveClass('w-full h-64 object-cover rounded-lg');
  });

  test('renders the overlay div with correct styling', () => {
    const overlay = screen.getByAltText('Icon of the Seas Cruise Ship').nextElementSibling;
    expect(overlay).toHaveClass('absolute inset-0 bg-black opacity-30 rounded-lg');
  });
});