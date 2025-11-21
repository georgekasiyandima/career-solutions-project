import { API_BASE_URL } from '../config/constants';

/**
 * Fetch all success stories from the API
 * @returns {Promise<Array>} Array of success stories
 */
export const getSuccessStories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/success-stories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching success stories:', error);
    throw error;
  }
};

/**
 * Fetch success stories statistics
 * @returns {Promise<Array>} Array of statistics
 */
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/success-stories/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Fetch timeline data for success stories
 * @returns {Promise<Array>} Array of timeline data
 */
export const getTimelineData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/success-stories/timeline`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    throw error;
  }
};

/**
 * Fetch a specific success story by ID
 * @param {number} storyId - The ID of the success story to fetch
 * @returns {Promise<Object>} Success story object
 */
export const getSuccessStoryById = async (storyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/success-stories/${storyId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching success story:', error);
    throw error;
  }
}; 