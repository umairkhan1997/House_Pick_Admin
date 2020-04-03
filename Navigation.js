import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button, Image, Platform
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// SCREENS
import MainPage from './screen/MainPage'
import AddPost from './screen/AddPost'
const Stack = createStackNavigator();


function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="AddPost" component={AddPost} />
    </Stack.Navigator>
  );
};

function MainNavi() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainStack" component={AddPost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default MainNavi;