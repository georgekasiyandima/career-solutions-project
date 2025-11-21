import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders App component with HeroSection heading', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, title: 'Success Story 1', content: 'Content 1' },
        ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, title: 'Feed Post 1', content: 'Post Content 1' },
        ]),
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Launch Your Cruise Ship Career')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});