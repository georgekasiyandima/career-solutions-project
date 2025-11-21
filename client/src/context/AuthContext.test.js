import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '../services/authService';

// Mock the authService
jest.mock('../services/authService');

const TestComponent = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) {
    return <div>Initializing...</div>;
  }
  return (
    <div>
      {isAuthenticated ? `User: ${user.name}` : 'No user'}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    authService.refreshToken.mockClear();
    authService.getMe.mockClear();
    authService.loginUser.mockClear();
    authService.logoutUser.mockClear();
  });

  it('should initialize with no user if refresh fails', async () => {
    authService.refreshToken.mockRejectedValue(new Error('No refresh token'));
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('should initialize with a user if refresh succeeds', async () => {
    const user = { id: 1, name: 'Test User' };
    authService.refreshToken.mockResolvedValue({ accessToken: 'new-token' });
    authService.getMe.mockResolvedValue(user);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByText(`User: ${user.name}`)).toBeInTheDocument();
  });

  it('should log in a user and update the context', async () => {
    const user = { id: 1, name: 'Test User' };
    authService.loginUser.mockResolvedValue({ user });
    authService.refreshToken.mockRejectedValue(new Error('No refresh token')); // Start as logged out

    const AuthConsumer = () => {
      const { login, user, isAuthenticated } = useAuth();
      return (
        <div>
          <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
            Login
          </button>
          {isAuthenticated ? `User: ${user.name}` : 'No user'}
        </div>
      );
    };

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Initial state
    expect(screen.getByText('No user')).toBeInTheDocument();

    // Log in
    await act(async () => {
        screen.getByText('Login').click();
    });

    expect(authService.loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(screen.getByText(`User: ${user.name}`)).toBeInTheDocument();
  });

  it('should log out a user and update the context', async () => {
    const user = { id: 1, name: 'Test User' };
    authService.refreshToken.mockResolvedValue({ accessToken: 'new-token' });
    authService.getMe.mockResolvedValue(user);
    authService.logoutUser.mockResolvedValue();

    const AuthConsumer = () => {
      const { logout, user, isAuthenticated } = useAuth();
      return (
        <div>
          <button onClick={logout}>Logout</button>
          {isAuthenticated ? `User: ${user.name}` : 'No user'}
        </div>
      );
    };

    await act(async () => {
        render(
          <AuthProvider>
            <AuthConsumer />
          </AuthProvider>
        );
    });
    
    // Initial state
    expect(screen.getByText(`User: ${user.name}`)).toBeInTheDocument();

    // Log out
    await act(async () => {
        screen.getByText('Logout').click();
    });

    expect(authService.logoutUser).toHaveBeenCalled();
    expect(screen.getByText('No user')).toBeInTheDocument();
  });
}); 