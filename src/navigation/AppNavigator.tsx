// Main navigation container
import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from './types';
import Theme from '../utils/theme';
import HamburgerMenu from '../components/HamburgerMenu';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const HamburgerButton = () => (
    <TouchableOpacity
      onPress={() => setMenuVisible(true)}
      style={{ paddingLeft: 16, paddingRight: 8 }}
    >
      <Text style={{ color: Theme.colors.textOnPrimary, fontSize: 24 }}>☰</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: Theme.colors.primary,
            },
            headerTintColor: Theme.colors.textOnPrimary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => <HamburgerButton />,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Tulcea Tourism',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="BusinessList"
            component={BusinessListScreen}
            options={({ route }) => ({
              title: route.params.categoryName,
            })}
          />
          <Stack.Screen
            name="BusinessDetail"
            component={BusinessDetailScreen}
            options={{
              title: 'Business Details',
            }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{
              title: 'Map View',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <HamburgerMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
};

export default AppNavigator;
