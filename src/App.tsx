import React, { useState } from 'react';
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
  Input,
  InputField
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
  garmentScreenSelectionStore,
  resultStore,
} from './store';
import {observer} from 'mobx-react-lite';
import {Footer} from './components/Footer';

import LikeIcon from '../assets/icons/like.svg';
import DislikeIcon from '../assets/icons/dislike.svg';
import EditIcon from '../assets/icons/edit.svg';

import WinterIcon from '../assets/icons/seasons/winter.svg';
import SpringIcon from '../assets/icons/seasons/spring.svg';
import SummerIcon from '../assets/icons/seasons/summer.svg';
import AutumnIcon from '../assets/icons/seasons/autumn.svg';



import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore, Season } from './stores/GarmentStore';

export const Stack = createNativeStackNavigator();

const HomeScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <StaticGarmentList navigation={navigation}/>
    </BaseScreen>
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

const UpdateableText = observer((props: {inEditing: boolean, text: string, onUpdate: (text: string)=>void}) => {
  return (
    <>
     {
        props.inEditing
        ? 
        <Input
          variant="rounded"
          size="md"
          w="90%"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
          // onChangeText={onUpdate}
        >
          <InputField type="text" value={props.text}></InputField>
        </Input>

        :  <RobotoText fontSize={24} {...props}>
          {props.text}
        </RobotoText>
     }
    </>
  )
});

const IconWithCaption = observer((props: {icon: React.ReactNode, caption: string}) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      {...props}
    >
      {props.icon}
      <RobotoText>{props.caption}</RobotoText>
      </Box>
  )
});

const GarmentScreen = observer(({navigation}: {navigation: any}) => {
  const garment = garmentScreenSelectionStore.selectedItem as GarmentCard;

  const [inEditing, setInEditing] = useState(false);

  const GarmentImage = () => {
    return (
      <Image 
        source={'file://' + RNFS.DocumentDirectoryPath + '/images/clothes' + garment.image.uri}
        w="auto"
        h={windowHeight / 2}
        resizeMode="contain"
        alt=""
      />
    )
  }

  const GarmentNameInput = () => {
    return (
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent='center'
        alignItems='center'
        gap={20}
      >
        <UpdateableText 
          text={garment.name}
          inEditing={inEditing}
          onUpdate={(text: string)=>{console.log(text)}}
        />
        <Pressable
          onPress={() => {
            setInEditing((oldInEditing: boolean) => !oldInEditing);
          }}
        >
          <EditIcon stroke="#000000"/>
        </Pressable>
      </Box>
    )
  }

  const GarmentSeasonIcons = () => {
    const seasonIconSize = 40

    const getFill = (season: Season) => {
      if (garment.seasons.includes(season)) {
        return active_color;
      }
  
      return '#000';
    }
  
    const seasonIconProps = (season: Season) => ({
      width: seasonIconSize,
      height: seasonIconSize,
      fill: getFill(season)
    })
  
    return (
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        gap={20}
      >
        <IconWithCaption icon={<WinterIcon {...seasonIconProps('winter')}/>} caption="зима" />
        <IconWithCaption icon={<SpringIcon {...seasonIconProps('spring')}/>} caption="весна" />
        <IconWithCaption icon={<SummerIcon {...seasonIconProps('summer')}/>} caption="лето" />
        <IconWithCaption icon={<AutumnIcon {...seasonIconProps('autumn')}/>} caption="осень" />
      </Box>
    )
  }

  return (
    <Box 
      display="flex" 
      flexDirection='column' 
      gap={20}
      alignContent='center'
      marginLeft={40}
      marginRight={40}
    >
      <GarmentImage/>
      <GarmentNameInput/>
      <GarmentSeasonIcons/>
    </Box>
  )
})

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

garmentStore.setTypes(
  [{
    uuid: '1',
    name: 'Ботинки'
  }],
  [{
    uuid: '2',
    name: 'Полусапоги',
    type_uuid: '1'
  }]
);

garmentStore.setStyles([{
  uuid: '1',
  name: 'Стиль'
}]);

garmentStore.setGarments([{
  uuid: '1',
  name: 'Мои ботиночки',
  color: '#0f0f0f',
  seasons: ['spring', 'autumn'],
  image: {
    uri: '/89d37d2e-99ee-4901-9ff3-3560db533285.jpg',
    type: 'local'
  }
}]);

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
