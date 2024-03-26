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
  ScrollView,
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
import {apiEndpoint, centrifugeEndpoint, endpoint, login, password} from '../config';

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

import CameraIcon from '../assets/icons/camera.svg';
import GalleryIcon from '../assets/icons/gallery.svg';

import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore } from './stores/GarmentStore';
import { GarmentScreen } from './screens/GarmentScreen';
import { convertGarmentResponse } from './utils';
import { Pressable } from '@gluestack-ui/themed';

import Animated from 'react-native-reanimated';
import { BounceInDown, BounceOutDown } from 'react-native-reanimated';
import { createGarmentFromCamera, createGarmentFromGallery, createUserPhotoFromGallery } from './requests/imageCreation';
import { Centrifuge } from 'centrifuge';
import { userPhotoStore } from './stores/UserPhotoStore';
import { filteredGarmentStore } from './stores/FilterStore';

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

        <Pressable 
          style={floatingStyle.menuItem}
          onPress={async () => {
            const created = await createUserPhotoFromGallery();
            if (!created) {
              console.log('not created')
            }
          }}
        >
          <GalleryIcon {...iconProps}/>
          <RobotoText fontSize={24}>Фото человека</RobotoText>
        </Pressable>
      </Box>
    </Animated.View>
  )
})

interface GarmentFilterBaseProps {
  text: string
  isSelected: boolean
  onPress: () => void
}

const GarmentFilterBase = observer((props: GarmentFilterBaseProps) => {
  const style = () => {
    let style = {
      margin: 10
    }
    if (props.isSelected) {
      Object.assign(style, {
        borderBottomColor: active_color,
        borderBottomWidth: 2
      })
    }

    return style;
  }

  return (
    <Pressable
      style={style()}
      onPress={props.onPress}
    >
      <RobotoText
        color={props.isSelected ? active_color : "#000000"}
      >
        {props.text}
      </RobotoText>
    </Pressable>
  )
})

const TypeFilter = observer(() => {
  // const baseFilters = [
  //   'Все',
  //   'Верх',
  //   'Низ',
  //   'Верхняя одежда',
  //   'Обувь'
  // ];

  const baseFilters = [{name: 'Все', filter: (item: GarmentCard)=>true}].concat(garmentStore.types.map(type => ({
    name: type.name,
    filter: (item: GarmentCard) => item.type?.uuid === type.uuid
  })));

  const [selectedId, setSelectedId] = useState<number>(0);

  return (
    <ScrollView
      display='flex'
      flexDirection='row'
      // justifyContent='space-around'
      gap={20}
      // marginLeft={40}
      // marginRight={40}
      horizontal={true}
    >
      {
        baseFilters.map((filter, i) => {
            return (
              <GarmentFilterBase 
                key={i} 
                text={filter.name} 
                isSelected={i === selectedId}
                onPress={() => {
                  if (i === selectedId) {
                    return;
                  }

                  if (selectedId !== 0) {
                    const old_key = baseFilters[selectedId].name;

                    filteredGarmentStore.removeFilter(old_key);
                  }


                  if (i !== 0) {
                    const new_filter = baseFilters[i]

                    filteredGarmentStore.addFilter(new_filter.name, new_filter.filter);
                  }

                  setSelectedId(i)
                }}
              />
            )
          }
        )
      }
    </ScrollView>
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
        <TypeFilter/>
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

        // const interval_id = setInterval(() => {
        //   fetch(
        //     endpoint +
        //       'user/2a78df8a-0277-4c72-a2d9-43fb8fef1d2c/try_on/62e29ffe-b3dd-4652-bc18-d4aebb76068f',
        //   )
        //     .then(res => {
        //       if (res.status === 200) {
        //         res
        //           .json()
        //           .then(data => {
        //             setTimeout(() => {
        //               resultStore.setResultUrl('static/try_on/' + data.url);
        //             }, 1000);
        //             clearInterval(interval_id);
        //           })
        //           .catch(reason => console.log(reason));
        //       }
        //     })
        //     .catch(reason => console.log(reason));
        // }, 1000);
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
  }).catch(err => processNetworkError(err))
}).catch(err => processNetworkError(err))

fetch(apiEndpoint + '/photos').then(async data => {
  data.json().then(async photos => {
    console.log(photos)
    userPhotoStore.setPhotos(photos.map((photo: {uuid: string}) => ({
      uuid: photo.uuid,
      image: {
        type: 'remote',
        uri: `/photos/${photo.uuid}`
      }
    })))
  }).catch(err => console.error(err))
}).catch(err => console.error(err))

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
  });
  
  try_on_sub.on('publication', function(ctx) {
    console.log(ctx.data);

    resultStore.setResultUrl(apiEndpoint + `/static/try-on/${ctx.data.image}`);
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
