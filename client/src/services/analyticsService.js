import { API_BASE_URL } from '../config/constants';
import { v4 as uuidv4 } from 'uuid';

const SESSION_ID_KEY = 'analytics_session_id';

// Function to get or create a session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Tracks an event by sending it to the analytics backend.
 *
 * @param {string} event_type - The type of event (e.g., 'page_view', 'cta_click').
 * @param {object} event_data - A JSON object containing details about the event.
 */
export const trackAnalyticsEvent = async (event_type, event_data) => {
  const token = localStorage.getItem('token');
  const sessionId = getSessionId();

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        event_type,
        event_data,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to track analytics event:', await response.json());
    }
  } catch (error) {
    console.error('Error in trackAnalyticsEvent:', error);
  }
};

// We can also create specific tracking functions for common events
export const trackPageView = (path) => {
  trackAnalyticsEvent('page_view', { path });
};

export const trackContentInteraction = (contentId, interactionType) => {
  trackAnalyticsEvent('content_interaction', { contentId, interactionType }); // e.g., 'like', 'share'
};

export const trackCtaClick = (buttonId, page) => {
  trackAnalyticsEvent('cta_click', { buttonId, page });
}; 