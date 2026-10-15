import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import PersonDetailsScreen from './src/screens/PersonDetailsScreen';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function PlaceholderScreen() {
  return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: colors.text }}>Coming soon</Text>
  </View>;
}

function MainTabs() {
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.panel, borderTopColor: colors.border, height: 64, paddingTop: 7, paddingBottom: 8 },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarIcon: ({ color, size }) => {
        const icons = { Discover: 'compass-outline', Search: 'search-outline', Watchlist: 'bookmark-outline' };
        return <Ionicons name={icons[route.name] || 'ellipse-outline'} color={color} size={size} />;
      }
    })}>
      <Tabs.Screen name="Discover" component={HomeScreen} />
      <Tabs.Screen name="Search" component={SearchScreen} />
      <Tabs.Screen name="Watchlist" component={WatchlistScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <WatchlistProvider>
      <NavigationContainer theme={{
        ...DarkTheme,
        colors: { ...DarkTheme.colors, background: colors.bg, card: colors.panel, text: colors.text, border: colors.border, primary: colors.accent }
      }}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg }
        }}>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} options={{ title: 'Movie details' }} />
          <Stack.Screen name="PersonDetails" component={PersonDetailsScreen} options={{ title: 'Cast & crew' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </WatchlistProvider>
  );
}