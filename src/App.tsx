import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {
  GluestackUIProvider,
} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {Header, BackHeader} from './components/Header';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {observer} from 'mobx-react-lite';

import RNFS from 'react-native-fs';
import { GarmentHeader, GarmentScreen } from './screens/GarmentScreen';

import { HomeScreen } from './screens/HomeScreen';
import { GarmentSelectionScreen, PersonSelectionScreen, TryOnMainScreen } from './screens/TryOnScreens';
import { ResultScreen } from './screens/ResultScreen';
import { initStores } from './requests/init';
import { active_color } from './consts';
import { appState } from './stores/AppState';

export const Stack = createNativeStackNavigator();

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

initStores();

const App = observer((): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const ScreenStack = observer(() => {
    console.log('rerender')
    const getFilterColor = () => {
      if (appState.filterModalVisible) {
        return active_color;
      }

      return "#000000";
    }
    return (
      <Stack.Navigator screenOptions={{header: () => <Header filterColor={getFilterColor()}/>}}>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Person" component={PersonSelectionScreen} />

        <Stack.Screen name="TryOn" component={TryOnMainScreen} />

        <Stack.Screen 
          name="Clothes" 
          component={GarmentSelectionScreen} 
        />

        <Stack.Screen name="Result" component={ResultScreen} />

        <Stack.Screen
          name="Garment" 
          component={GarmentScreen} 
          options={
            {header: GarmentHeader}
          }
        />
      </Stack.Navigator>
  )
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <ScreenStack/>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
});

export default App;
