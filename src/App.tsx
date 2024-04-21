import React, { useEffect } from 'react';
import {PermissionsAndroid, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {
  GluestackUIProvider,
} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {observer} from 'mobx-react-lite';

import RNFS from 'react-native-fs';
import { GarmentScreen } from './screens/GarmentScreen';

import { HomeScreen } from './screens/HomeScreen';
import { GarmentSelectionScreen, PersonSelectionScreen, TryOnMainScreen } from './screens/TryOnScreens';
import { ResultScreen } from './screens/ResultScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OutfitEditorScreen } from './screens/outfit/OutfitEditorScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OutfitScreen } from './screens/outfit/OutfitScreen';
import { OutfitSelectionScreen } from './screens/outfit/OutfitSelectionScreen';
import { OutfitGenFormScreen } from './screens/outfit/OutfitGenForm';
import { OutfitGenResultScreen } from './screens/outfit/OutfitGenResult';
import { LoginScreen } from './screens/LoginScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { PostScreen } from './screens/PostScreen';
import { FeedScreen } from './screens/FeedScreen';
import { TryOnCardScreen } from './screens/TryOnCardScreen';
import { OutfitGarmentSelectionScreen } from './screens/outfit/OutfitGarmentSelectionScreen';

export const Stack = createNativeStackNavigator();

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

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
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Loading'>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Feed" component={FeedScreen} />

        <Stack.Screen name="Post" component={PostScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Person" component={PersonSelectionScreen} />

        <Stack.Screen name="Profile" component={ProfileScreen} />

        <Stack.Screen name="TryOn" component={TryOnMainScreen} />

        <Stack.Screen name="TryOnCard" component={TryOnCardScreen} />

        <Stack.Screen name="Clothes" component={GarmentSelectionScreen} />

        <Stack.Screen name="Result" component={ResultScreen} />

        <Stack.Screen name="Garment" component={GarmentScreen} />

        <Stack.Screen name="OutfitSelection" component={OutfitSelectionScreen} />
        <Stack.Screen name="Outfit" component={OutfitScreen} />
        <Stack.Screen name="Outfit/Garment" component={OutfitGarmentSelectionScreen}/>

        <Stack.Screen
          name="Editor"
          component={OutfitEditorScreen}
        />

        <Stack.Screen
          name="OutfitGenForm"
          component={OutfitGenFormScreen}
        />

        <Stack.Screen
          name="OutfitGenResult"
          component={OutfitGenResultScreen}
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
