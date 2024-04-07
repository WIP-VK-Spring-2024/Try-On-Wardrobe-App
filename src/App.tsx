import React, { useEffect } from 'react';
import {PermissionsAndroid, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
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
import { ACTIVE_COLOR } from './consts';
import { appState } from './stores/AppState';
import { KitEditorHeader, KitEditorScreen } from './screens/KitEditorScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GarmentKitScreen } from './screens/GarmentKitScreen';

export const Stack = createNativeStackNavigator();

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

initStores();

const App = observer((): JSX.Element => {
  useEffect(() => {
    requestPermission()
  }, [])

  const requestPermission = async () => {
    try {
      console.log('asking for permission')
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        ]
      )
      if (granted['android.permission.CAMERA'] && granted['android.permission.WRITE_EXTERNAL_STORAGE'] && granted['android.permission.READ_MEDIA_IMAGES']) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (error) {
      console.log('permission error', error)
    }
  }

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  const ScreenStack = observer(() => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Person" component={PersonSelectionScreen} />

        <Stack.Screen name="TryOn" component={TryOnMainScreen} />

        <Stack.Screen name="Clothes" component={GarmentSelectionScreen} />

        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Garment" component={GarmentScreen} />

        <Stack.Screen name="GarmentKit" component={GarmentKitScreen} />

        <Stack.Screen
          name="Editor"
          component={KitEditorScreen}
          options={
            {header: KitEditorHeader}
          }
        />
      </Stack.Navigator>
  )
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GluestackUIProvider config={config}>
        <GestureHandlerRootView>
          <NavigationContainer>
            <ScreenStack/>
          </NavigationContainer>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </SafeAreaView>
  );
});

export default App;
