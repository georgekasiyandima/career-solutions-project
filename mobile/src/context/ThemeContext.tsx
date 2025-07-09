import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme} from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  theme: typeof lightTheme;
}

interface ThemeContextType extends ThemeState {
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const initialState: ThemeState = {
  mode: 'system',
  theme: lightTheme,
};

type ThemeAction =
  | {type: 'SET_THEME_MODE'; payload: ThemeMode}
  | {type: 'SET_THEME'; payload: typeof lightTheme};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME_MODE':
      return {...state, mode: action.payload};
    case 'SET_THEME':
      return {...state, theme: action.payload};
    default:
      return state;
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    loadStoredTheme();
  }, []);

  useEffect(() => {
    updateTheme();
  }, [state.mode, systemColorScheme]);

  const loadStoredTheme = async () => {
    try {
      const storedMode = await AsyncStorage.getItem('themeMode');
      if (storedMode) {
        dispatch({type: 'SET_THEME_MODE', payload: storedMode as ThemeMode});
      }
    } catch (error) {
      console.error('Error loading stored theme:', error);
    }
  };

  const updateTheme = () => {
    let theme;
    if (state.mode === 'system') {
      theme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      theme = state.mode === 'dark' ? darkTheme : lightTheme;
    }
    dispatch({type: 'SET_THEME', payload: theme});
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      dispatch({type: 'SET_THEME_MODE', payload: mode});
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = state.mode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const value: ThemeContextType = {
    ...state,
    setThemeMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 