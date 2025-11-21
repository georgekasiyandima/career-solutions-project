import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {
    // Simulate element being in view
    this.callback([{ isIntersecting: true }], this);
  }
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;
