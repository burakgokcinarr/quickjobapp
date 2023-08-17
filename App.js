import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import RouteNavigation from './src/navigation/RouteNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <RouteNavigation/>
    </NavigationContainer>
  )
}