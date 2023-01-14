import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from './screens/Login';
import Home from './screens/Home';
import Search from './screens/Search';
import Profile from './screens/Profile';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Index') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'ios-search' : 'ios-search-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Index" component={Home} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeTabScreen} />
        <Stack.Screen
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => (
              <Button
                onPress={() => navigation.replace('Home') }
                title="Back"
              />
            ),
          })}
          name="Profile"
          component={Profile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;