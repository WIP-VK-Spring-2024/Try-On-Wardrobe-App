import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {GluestackUIProvider, Box} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import { GarmentList } from './components/GarmentList';
import { Header } from './components/Header';
import { RobotoText } from './components/common';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseScreen } from './components/base';

export const Stack = createNativeStackNavigator();

const GarmentScreen = ({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <GarmentList/>
    </BaseScreen>
  )
}

const AnotherScreen = ({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <RobotoText>Another page</RobotoText>
    </BaseScreen>
  )
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{header: Header}}
          >
            <Stack.Screen
              name="Home"
              component={GarmentScreen}
            />

            <Stack.Screen
              name="Another"
              component={AnotherScreen}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}

export default App;
