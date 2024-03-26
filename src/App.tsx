import React from 'react';
import {BackHandler, SafeAreaView, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {
  GluestackUIProvider,
  Box,
  Spinner,
  HStack,
  Image,
} from '@gluestack-ui/themed';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {
  GarmentList,
  PeopleList,
  StaticGarmentList,
} from './components/GarmentList';
import {Header} from './components/Header';
import {RobotoText} from './components/common';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BaseScreen} from './screens/base';
import {active_color} from './consts';
import {apiEndpoint, centrifugeEndpoint, endpoint, login, password, staticEndpoint} from '../config';

import {
  garmentScreenSelectionStore,
  resultStore,
  userPhotoSelectionStore,
} from './store';
import { appState } from './stores/AppState';
import {observer} from 'mobx-react-lite';
import {ButtonFooter, Footer} from './components/Footer';

import LikeIcon from '../assets/icons/like.svg';
import DislikeIcon from '../assets/icons/dislike.svg';

import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { GarmentScreen } from './screens/GarmentScreen';
import { convertGarmentResponse } from './utils';
import { Pressable } from '@gluestack-ui/themed';

import { createGarmentFromCamera, createGarmentFromGallery, createUserPhotoFromGallery } from './requests/imageCreation';
import { Centrifuge } from 'centrifuge';
import { userPhotoStore } from './stores/UserPhotoStore';
import { filteredGarmentStore } from './stores/FilterStore';
import { TypeFilter } from './components/FilterBlock';

export const Stack = createNativeStackNavigator();

const HomeScreen = observer(({navigation}: {navigation: any}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (appState.createMenuVisible) {
          appState.setCreateMenuVisible(false);
          return true;
        }

        return false;
      }

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [appState.createMenuVisible])
  )

  return (
    <BaseScreen navigation={navigation}>
      <TypeFilter/>
      <StaticGarmentList navigation={navigation}/>
    </BaseScreen>
  );
});

const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = true ? (
    <ButtonFooter
      onPress={() => {
        const tryOnBody = {
          clothes_id: garmentScreenSelectionStore.selectedItem.uuid,
          user_image_id: userPhotoSelectionStore.selectedItem.uuid
        }

        fetch(
          apiEndpoint + '/try-on',
          {
            method: 'POST',
            body: JSON.stringify(tryOnBody),
            headers: {
              'Content-Type': 'application/json'
            }
          },
        ).then(() => {
          navigation.navigate('Result');
          resultStore.clearResult();
        }).catch(err => console.error(err))
      }}
    />
  ) : (
    <Footer navigation={navigation} />
  );
  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <GarmentList navigation={navigation}/>
    </BaseScreen>
  );
});

const ForwardFooter = observer(
  ({navigation, destination}: {navigation: any; destination: string}) => {
    return <ButtonFooter text="Выбрать" onPress={() => navigation.navigate(destination)} />;
  },
);

const PersonSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = userPhotoSelectionStore.somethingIsSelected ? (
    <ForwardFooter navigation={navigation} destination="Clothes" />
  ) : (
    <Footer navigation={navigation} />
  );

  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <PeopleList />
    </BaseScreen>
  );
});

const ResultScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <Box
        h={800}
        w="100%"
        display="flex"
        justifyContent="center"
        alignItems="center">
        {resultStore.resultUrl === undefined ? (
          <HStack>
            <Spinner size="large" color={active_color} />
            <RobotoText>Загрузка...</RobotoText>
          </HStack>
        ) : (
          <Box w="100%" h="100%" display="flex" flexDirection="column">
            <Image
              w="100%"
              h="80%"
              source={resultStore.resultUrl}
              alt="result"
            />
            <Box
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center">
              <DislikeIcon width={50} height={50} />
              <LikeIcon width={50} height={50} />
            </Box>
          </Box>
        )}
      </Box>
    </BaseScreen>
  );
});

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

const processNetworkError = (err: any) => {
  console.log(err);
  appState.setError('network')
}

const typesRequest = fetch(apiEndpoint + '/types').then(data => {
  return data.json().then(types => {
    garmentStore.setTypes(types)
    return true;
  }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

const stylesRequest = fetch(apiEndpoint + '/styles').then(data => {
  return data.json().then(styles => {
    garmentStore.setStyles(styles);
    return true;
  }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

fetch(apiEndpoint + '/clothes').then(async data => {
  data.json().then(async clothes => {
    await Promise.all([typesRequest, stylesRequest]);
    
    const garmentCards = clothes.map(convertGarmentResponse)

    garmentStore.setGarments(garmentCards);
  }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

fetch(apiEndpoint + '/photos').then(async data => {
  data.json().then(async photos => {
    console.log('photos', photos)
    userPhotoStore.setPhotos(photos.map((photo: {uuid: string}) => ({
      uuid: photo.uuid,
      image: {
        type: 'remote',
        uri: `/photos/${photo.uuid}`
      }
    })))
  }).catch(err => console.error(err))
}).catch(err => console.error(err))

const loginFunc = async () => {
  const loginBody = {
    name: login,
    password: password
  }

  const response = await fetch(apiEndpoint + '/login', {
    method: 'POST',
    body: JSON.stringify(loginBody),
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    console.error(response);
    return;
  }

  const json = await response.json();

  console.log(json);

  appState.login(json.token, json.user_id);

  const centrifuge = new Centrifuge(centrifugeEndpoint, {
    token: json.token
  });
  
  centrifuge.on('connecting', function(ctx) {
    console.log('connecting', ctx);
  });
  
  centrifuge.on('connected', function(ctx) {
    console.log('connected', ctx);
  });
  
  centrifuge.on('disconnected', function(ctx) {
    console.log('disconnected', ctx);
  });
  
  const processing_sub = centrifuge.newSubscription(`processing:user#${json.user_id}`);
  const try_on_sub = centrifuge.newSubscription(`try-on:user#${json.user_id}`);

  processing_sub.on('subscribing', function(ctx) {
    console.log('subscribing to processing');
  });

  processing_sub.on('subscribed', function(ctx) {
    console.log('subscribed to processing');
  });

  processing_sub.on('unsubscribed', function(ctx) {
    console.log('unsubscribed from porcessing');
  });

  try_on_sub.on('subscribing', function(ctx) {
    console.log('subscribing to try on');
  });

  try_on_sub.on('subscribed', function(ctx) {
    console.log('subscribed to try on');
  });

  try_on_sub.on('unsubscribed', function(ctx) {
    console.log('unsubscribed from try on');
  });

  processing_sub.on('publication', function(ctx) {
    console.log(ctx.data);

    garmentStore.garments.find(garment => garment.uuid === ctx.data.uuid)?.setImage({
      type: 'remote',
      uri: `/photos/${ctx.data.uuid}`
    })
  });
  
  try_on_sub.on('publication', function(ctx) {
    console.log(ctx.data);

    console.log(staticEndpoint + ctx.data.imgae)
    resultStore.setResultUrl(staticEndpoint + ctx.data.image);
  });

  processing_sub.on('error', function(ctx) {
    console.log("subscription error", ctx);
  });
  
  processing_sub.subscribe();
  try_on_sub.subscribe();
  
  centrifuge.connect();
}

loginFunc();

const App = observer((): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{header: Header}}>
            <Stack.Screen name="Home" component={HomeScreen} />

            <Stack.Screen name="Person" component={PersonSelectionScreen} />

            <Stack.Screen name="Clothes" component={GarmentSelectionScreen} />

            <Stack.Screen name="Result" component={ResultScreen} />

            <Stack.Screen name="Garment" component={GarmentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
});

export default App;
