import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SuccessStories from './SuccessStories';
import * as successStoriesService from '../../services/successStoriesService';

jest.mock('../../services/successStoriesService');

const mockStories = [
  { id: 1, name: 'John Doe', role: 'Developer', company: 'Tech Corp', testimonial: 'Great!', photo_url: '', hired_date: '2023-01-01' },
  { id: 2, name: 'Jane Smith', role: 'Designer', company: 'Design Co', testimonial: 'Awesome!', photo_url: '', hired_date: '2023-02-01' },
];

const mockStats = [
  { label: 'Hired', value: 100, icon: 'Person' },
];

const mockTimeline = [
  { title: 'Step 1', description: 'First step', icon: 'Psychology' },
];

const renderComponent = () =>
  render(
    <MemoryRouter>
      <SuccessStories />
    </MemoryRouter>
  );

describe('SuccessStories Page', () => {
  beforeEach(() => {
    successStoriesService.getSuccessStories.mockClear();
    successStoriesService.getStats.mockClear();
    successStoriesService.getTimelineData.mockClear();
  });

  it('should display a loading state initially', () => {
    successStoriesService.getSuccessStories.mockReturnValue(new Promise(() => {}));
    successStoriesService.getStats.mockReturnValue(new Promise(() => {}));
    successStoriesService.getTimelineData.mockReturnValue(new Promise(() => {}));
    
    renderComponent();
    
    expect(screen.getByText(/Loading inspiring stories.../i)).toBeInTheDocument();
  });

  it('should render success stories, stats, and timeline on successful fetch', async () => {
    successStoriesService.getSuccessStories.mockResolvedValue(mockStories);
    successStoriesService.getStats.mockResolvedValue(mockStats);
    successStoriesService.getTimelineData.mockResolvedValue(mockTimeline);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Hired')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  it('should display an error message if fetching data fails', async () => {
    const errorMessage = 'Failed to fetch data';
    successStoriesService.getSuccessStories.mockRejectedValue(new Error(errorMessage));
    successStoriesService.getStats.mockRejectedValue(new Error(errorMessage));
    successStoriesService.getTimelineData.mockRejectedValue(new Error(errorMessage));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/An error occurred while fetching data/i)).toBeInTheDocument();
    });
  });
}); 