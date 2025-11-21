import { API_BASE_URL } from '../config/constants';

/**
 * Fetch all services from the API
 * @returns {Promise<Array>} Array of services
 */
export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Fetch a specific service by ID
 * @param {number} serviceId - The ID of the service to fetch
 * @returns {Promise<Object>} Service object
 */
export const getServiceById = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

/**
 * Create a new service enquiry
 * @param {Object} enquiryData - The enquiry data
 * @returns {Promise<Object>} Response from the server
 */
export const createServiceEnquiry = async (enquiryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiryData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating service enquiry:', error);
    throw error;
  }
}; 