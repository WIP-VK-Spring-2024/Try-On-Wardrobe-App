import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {
  GluestackUIProvider,
} from '@gluestack-ui/themed';
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {observer} from 'mobx-react-lite';

import { GarmentScreen } from './screens/GarmentScreen';

import { HomeScreen } from './screens/HomeScreen';
import { TryOnGarmentSelectionScreen, PersonSelectionScreen, TryOnMainScreen } from './screens/TryOnScreens';
import { ResultScreen } from './screens/ResultScreen';
import { CurrentUserProfileScreen } from './screens/ProfileScreen';
import { OtherUserProfileScreen } from './screens/OtherProfileScreen';
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
import { OnboardingScreen } from './screens/OnboardingScreen';
import { TryOnCardScreen } from './screens/TryOnCardScreen';
import { OutfitGarmentSelectionScreen } from './screens/outfit/OutfitGarmentSelectionScreen';
import { cacheManager } from './cacheManager/cacheManager';
import { initCentrifuge } from './requests/centrifuge';
import { initStores } from './requests/init';

export const Stack = createNativeStackNavigator();

const navigationContainerRef = createNavigationContainerRef();

cacheManager.readToken()
  .then(async (token) => {
    if (navigationContainerRef.current === null) {
      console.error('No navigation container');
      return;
    }

    if (token === false) {
      navigationContainerRef.current.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      return;
    }

    const status = await cacheManager.updateToken(token);
    if (status === false) {
      navigationContainerRef.current.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {

      initCentrifuge();

      const initStatus = await initStores();

      navigationContainerRef.current.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  })
  .catch(reason => {
    console.error(reason);
  })

const App = observer((): JSX.Element => {
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
  };

  const ScreenStack = observer(() => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Loading'>
        <Stack.Screen name="Loading" component={LoadingScreen} />

        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Feed" component={FeedScreen} />

        <Stack.Screen name="Post" component={PostScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="TryOn/Person" component={PersonSelectionScreen} />

        <Stack.Screen name="Profile" component={CurrentUserProfileScreen} />
        <Stack.Screen name="OtherProfile" component={OtherUserProfileScreen} />

        <Stack.Screen name="TryOn" component={TryOnMainScreen} />

        <Stack.Screen name="TryOnCard" component={TryOnCardScreen} />

        <Stack.Screen name="TryOn/Clothes" component={TryOnGarmentSelectionScreen} />

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
          <NavigationContainer ref={navigationContainerRef}>
            <ScreenStack/>
          </NavigationContainer>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </SafeAreaView>
  );
});

export default App;
