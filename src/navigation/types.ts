// Navigation types for React Navigation
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  BusinessList: {
    categoryId: string;
    categoryName: string;
  };
  BusinessDetail: {
    businessId: string;
  };
  Map: {
    categoryId?: string;
  };
  Settings: undefined;
};

// Navigation prop types for each screen
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type BusinessListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BusinessList'>;
export type BusinessDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BusinessDetail'>;
export type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

// Route prop types for each screen
export type BusinessListScreenRouteProp = RouteProp<RootStackParamList, 'BusinessList'>;
export type BusinessDetailScreenRouteProp = RouteProp<RootStackParamList, 'BusinessDetail'>;
export type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;
