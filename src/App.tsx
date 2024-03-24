import React, { useState } from 'react';
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
import {active_color, windowHeight, windowWidth} from './consts';
import {apiEndpoint, endpoint} from '../config';

import {
  appState,
  garmentScreenSelectionStore,
  resultStore,
} from './store';
import {observer} from 'mobx-react-lite';
import {ButtonFooter, Footer} from './components/Footer';

import LikeIcon from '../assets/icons/like.svg';
import DislikeIcon from '../assets/icons/dislike.svg';

import CameraIcon from '../assets/icons/camera.svg';
import GalleryIcon from '../assets/icons/gallery.svg';

import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { GarmentScreen } from './screens/GarmentScreen';
import { convertGarmentResponse } from './utils';
import { Pressable } from '@gluestack-ui/themed';

import Animated from 'react-native-reanimated';
import { BounceInDown, BounceOutDown } from 'react-native-reanimated';
import { createGarmentFromCamera, createGarmentFromGallery } from './requests/imageCreation';

export const Stack = createNativeStackNavigator();

const AddMenu = observer((props: {navigation: any}) => {
  const floatingStyle = StyleSheet.create({
    container: {
      width: '100%',
      margin: 10,
      position: 'absolute',
      bottom: 70,
    },
    menu: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',

      gap: 10,

      alignSelf: 'center',

      padding: 20,

      backgroundColor: '#ffffff',
      borderRadius: 20,
    },
    menuItem: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  })

  const seasonIconSize = 40

  const iconProps = {
    width: seasonIconSize,
    height: seasonIconSize,
    fill: active_color
  };

  const openCreatedGarment = () => {
    const index = garmentScreenSelectionStore.items.length - 1;
    garmentScreenSelectionStore.select(index);
    props.navigation.navigate('Garment');   
  }

  return (
    <Animated.View
      style={floatingStyle.container}
      entering={BounceInDown}
      exiting={BounceOutDown}
    >
      <Box
        style={floatingStyle.menu}
      >
        <Pressable 
          style={floatingStyle.menuItem}
          onPress={async () => {
            const created = await createGarmentFromGallery();
            if (created) {
              openCreatedGarment();
            }
          }}
        >
          <GalleryIcon {...iconProps}/>
          <RobotoText fontSize={24}>Из галереи</RobotoText>
        </Pressable>
        <Pressable 
          style={floatingStyle.menuItem}
          onPress={async () => {
            const created = await createGarmentFromCamera();
            if (created) {
              openCreatedGarment();
            }
          }}
        >
          <CameraIcon {...iconProps}/>
          <RobotoText fontSize={24}>Камера</RobotoText>
        </Pressable>
      </Box>
    </Animated.View>
  )
})

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
    <>
      <BaseScreen navigation={navigation}>
        <StaticGarmentList navigation={navigation}/>

      </BaseScreen>
      { appState.createMenuVisible && <AddMenu navigation={navigation}/>}
    </>
  );
});

const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = true ? (
    <ButtonFooter
      onPress={() => {
        navigation.navigate('Result');

        fetch(
          endpoint +
            'user/2a78df8a-0277-4c72-a2d9-43fb8fef1d2c/try_on/62e29ffe-b3dd-4652-bc18-d4aebb76068f',
          {
            method: 'POST',
          },
        );

        const interval_id = setInterval(() => {
          fetch(
            endpoint +
              'user/2a78df8a-0277-4c72-a2d9-43fb8fef1d2c/try_on/62e29ffe-b3dd-4652-bc18-d4aebb76068f',
          )
            .then(res => {
              if (res.status === 200) {
                res
                  .json()
                  .then(data => {
                    setTimeout(() => {
                      resultStore.setResultUrl('static/try_on/' + data.url);
                    }, 1000);
                    clearInterval(interval_id);
                  })
                  .catch(reason => console.log(reason));
              }
            })
            .catch(reason => console.log(reason));
        }, 1000);
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
    return <ButtonFooter onPress={() => navigation.navigate(destination)} />;
  },
);

const PersonSelectionScreen = observer(({navigation}: {navigation: any}) => {
  // const footer = peopleSelectionStore.somethingSelected ? (
  //   <ForwardFooter navigation={navigation} destination="Clothes" />
  // ) : (
  //   <Footer navigation={navigation} />
  // );

  const footer = <Footer navigation={navigation} />;

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
              source={endpoint + resultStore.resultUrl}
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

// fetch(endpoint + 'user/2a78df8a-0277-4c72-a2d9-43fb8fef1d2c/clothes').then(
//   res => res.json().then(data => {
//       clothesSelectionStore.setItems(data.map((el: any) => el.Image))
//     }
//   )
// )

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

// RNFS.readDir(pictures_path).then(items => {
//   // clothesSelectionStore.setItems(items.map(item => ({type: 'local', uri: item.path})));
// });

// peopleSelectionStore.setItems(['person.jpg']);

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
    garmentScreenSelectionStore.setItems(garmentStore.garments);
  }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

// garmentStore.setGarments([new GarmentCard({
//   uuid: '1',
//   name: 'Мои ботиночки',
//   color: '#0f0f0f',
//   seasons: ['spring', 'autumn'],
//   image: {
//     uri: '/1.png',
//     type: 'local'
//   },
//   tags: [
//     'кожа',
//     'skvorcovski',
//     'шнурки',
//     'удобные',
//     'маломерки'
//   ]
// })]);

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
