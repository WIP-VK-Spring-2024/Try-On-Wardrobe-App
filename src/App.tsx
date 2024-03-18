import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {
  GluestackUIProvider,
  Box,
  Pressable,
  Text,
  Center,
  Spinner,
  HStack,
  Image,
} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {
  GarmentList,
  PeopleList,
  StaticGarmentList,
} from './components/GarmentList';
import {Header} from './components/Header';
import {RobotoText} from './components/common';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BaseScreen} from './components/base';
import {active_color, windowHeight, windowWidth} from './consts';
import {endpoint} from '../config';

import {
  peopleSelectionStore,
  clothesSelectionStore,
  resultStore,
} from './store';
import {observer} from 'mobx-react-lite';
import {Footer} from './components/Footer';

import LikeIcon from '../assets/icons/like.svg';
import DislikeIcon from '../assets/icons/dislike.svg';

import RNFS from 'react-native-fs';

export const Stack = createNativeStackNavigator();

const HomeScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <StaticGarmentList />
    </BaseScreen>
  );
});

const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = clothesSelectionStore.somethingSelected ? (
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
              console.log();
              if (res.status === 200) {
                res
                  .json()
                  .then(data => {
                    console.log(data);

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
      <GarmentList />
    </BaseScreen>
  );
});

const ButtonFooter = observer(({onPress}: {onPress: () => void}) => {
  return (
    <Pressable onPress={() => onPress()} bgColor={active_color} h={65}>
      <Center>
        <Text color="white" fontSize="$3xl">
          Выбрать
        </Text>
      </Center>
    </Pressable>
  );
});

const ForwardFooter = observer(
  ({navigation, destination}: {navigation: any; destination: string}) => {
    return <ButtonFooter onPress={() => navigation.navigate(destination)} />;
  },
);

const PersonSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = peopleSelectionStore.somethingSelected ? (
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

// const localPath = async (image) => {
//   const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//   await RNFS.copyFile(image, newPath);

//   return newPath;
// }

// RNFS.writefile(RNFS.DocumentDirectoryPath + '1.png', require())

// clothesSelectionStore.setItems(['1.png', '2.png', '3.png', '4.png', '5.png', '6.png']);

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';
console.log(pictures_path);

RNFS.mkdir(pictures_path);

RNFS.readDir(pictures_path).then(items => {
  console.log(items);
  clothesSelectionStore.setItems(items.map(item => item.path));
});

peopleSelectionStore.setItems(['person.jpg']);

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
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
});

export default App;
