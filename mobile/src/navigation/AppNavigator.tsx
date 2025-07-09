import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useAuth} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import JobsScreen from '../screens/main/JobsScreen';
import JobDetailsScreen from '../screens/main/JobDetailsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import EnquiriesScreen from '../screens/main/EnquiriesScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ContentScreen from '../screens/main/ContentScreen';
import SuccessStoriesScreen from '../screens/main/SuccessStoriesScreen';
import InterviewResourcesScreen from '../screens/main/InterviewResourcesScreen';

// Common Components
import LoadingScreen from '../screens/common/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const HomeTab = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Jobs':
            iconName = 'work';
            break;
          case 'Search':
            iconName = 'search';
            break;
          case 'Notifications':
            iconName = 'notifications';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Jobs" component={JobsScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MainTabs"
      component={HomeTab}
      options={{headerShown: false}}
    />
    <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    <Stack.Screen name="Bookings" component={BookingsScreen} />
    <Stack.Screen name="Enquiries" component={EnquiriesScreen} />
    <Stack.Screen name="Content" component={ContentScreen} />
    <Stack.Screen name="SuccessStories" component={SuccessStoriesScreen} />
    <Stack.Screen name="InterviewResources" component={InterviewResourcesScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  // Temporarily bypass authentication for testing
  const shouldShowMain = true; // isAuthenticated;

  if (isLoading && !shouldShowMain) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {shouldShowMain ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 