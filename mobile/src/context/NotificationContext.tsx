import React, {createContext, useContext, useReducer, useEffect} from 'react';
import {notificationService} from '../services/notificationService';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface NotificationContextType extends NotificationState {
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  clearNotifications: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

type NotificationAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_NOTIFICATIONS'; payload: Notification[]}
  | {type: 'ADD_NOTIFICATION'; payload: Notification}
  | {type: 'MARK_AS_READ'; payload: number}
  | {type: 'MARK_ALL_AS_READ'}
  | {type: 'CLEAR_NOTIFICATIONS'};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_NOTIFICATIONS':
      const unreadCount = action.payload.filter(n => !n.read).length;
      return {...state, notifications: action.payload, unreadCount};
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      const newUnreadCount = state.unreadCount + (action.payload.read ? 0 : 1);
      return {...state, notifications: newNotifications, unreadCount: newUnreadCount};
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? {...n, read: true} : n
      );
      const updatedUnreadCount = updatedNotifications.filter(n => !n.read).length;
      return {...state, notifications: updatedNotifications, unreadCount: updatedUnreadCount};
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(n => ({...n, read: true}));
      return {...state, notifications: allReadNotifications, unreadCount: 0};
    case 'CLEAR_NOTIFICATIONS':
      return {...state, notifications: [], unreadCount: 0};
    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const notifications = await notificationService.getNotifications();
      dispatch({type: 'SET_NOTIFICATIONS', payload: notifications});
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      dispatch({type: 'MARK_AS_READ', payload: id});
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch({type: 'MARK_ALL_AS_READ'});
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    dispatch({type: 'ADD_NOTIFICATION', payload: newNotification});
  };

  const clearNotifications = () => {
    dispatch({type: 'CLEAR_NOTIFICATIONS'});
  };

  const value: NotificationContextType = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 