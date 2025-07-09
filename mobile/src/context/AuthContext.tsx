import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../services/authService';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

type AuthAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_USER'; payload: User}
  | {type: 'SET_TOKEN'; payload: string}
  | {type: 'SET_AUTHENTICATED'; payload: boolean}
  | {type: 'LOGOUT'}
  | {type: 'UPDATE_USER'; payload: Partial<User>};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_USER':
      return {...state, user: action.payload, isAuthenticated: true};
    case 'SET_TOKEN':
      return {...state, token: action.payload};
    case 'SET_AUTHENTICATED':
      return {...state, isAuthenticated: action.payload};
    case 'LOGOUT':
      return {...initialState, isLoading: false};
    case 'UPDATE_USER':
      return {...state, user: state.user ? {...state.user, ...action.payload} : null};
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({type: 'SET_TOKEN', payload: token});
        dispatch({type: 'SET_USER', payload: user});
        dispatch({type: 'SET_AUTHENTICATED', payload: true});
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const response = await authService.login(email, password);
      
      await Promise.all([
        AsyncStorage.setItem('token', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
      ]);

      dispatch({type: 'SET_TOKEN', payload: response.token});
      dispatch({type: 'SET_USER', payload: response.user});
      dispatch({type: 'SET_AUTHENTICATED', payload: true});
    } catch (error) {
      throw error;
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const response = await authService.register(userData);
      
      await Promise.all([
        AsyncStorage.setItem('token', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
      ]);

      dispatch({type: 'SET_TOKEN', payload: response.token});
      dispatch({type: 'SET_USER', payload: response.user});
      dispatch({type: 'SET_AUTHENTICATED', payload: true});
    } catch (error) {
      throw error;
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('user'),
      ]);
      dispatch({type: 'LOGOUT'});
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({type: 'UPDATE_USER', payload: updatedUser});
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      await AsyncStorage.setItem('token', response.token);
      dispatch({type: 'SET_TOKEN', payload: response.token});
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 