const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const trackEvent = async (eventType, eventData) => {
  try {
    await fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        event_data: eventData,
      }),
    });
  } catch (err) {
    console.error('Error tracking event:', err);
  }
};

export default trackEvent;