import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {config} from '@gluestack-ui/config';
import {GluestackUIProvider, Box, Pressable, Text, Center, Spinner, HStack} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import { GarmentList, PeopleList, StaticGarmentList } from './components/GarmentList';
import { Header } from './components/Header';
import { RobotoText } from './components/common';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseScreen } from './components/base';
import { active_color, windowHeight, windowWidth } from './consts';
import { endpoint } from '../config';

import { peopleSelectionStore, clothesSelectionStore } from './store';
import { observer } from 'mobx-react-lite';
import { Footer } from './components/Footer';

export const Stack = createNativeStackNavigator();

const HomeScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <StaticGarmentList/>
    </BaseScreen>
  )
})

const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = clothesSelectionStore.somethingSelected
                ? <ForwardFooter navigation={navigation} destination='Result'/>
                : <Footer navigation={navigation} />
  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <GarmentList/>
    </BaseScreen>
  )
})

const ForwardFooter = observer(({navigation, destination}: {navigation: any, destination: string}) => {
  return (
    <Pressable 
      onPress={()=>navigation.navigate(destination)} 
      bgColor={active_color} h={65}
    >
      <Center>
        <Text color="white" fontSize="$3xl">Выбрать</Text>
      </Center>
    </Pressable>
  )
})

const PersonSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = peopleSelectionStore.somethingSelected
                 ? <ForwardFooter navigation={navigation} destination='Clothes'/>
                 : <Footer navigation={navigation} />

  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <PeopleList/>
    </BaseScreen>
  )
})

const ResultScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <Box h={600} w="100%"
        display="flex" justifyContent='center' alignItems='center'
      >
          <HStack>
            <Spinner size="large" color={active_color}/>
            <RobotoText>Загрузка...</RobotoText>
          </HStack>
      </Box>
    </BaseScreen>
  )
})

fetch(endpoint + 'user/2a78df8a-0277-4c72-a2d9-43fb8fef1d2c/clothes').then(
  res => res.json().then(data => {
      clothesSelectionStore.setItems(data.map((el: any) => el.Image))
    }
  )
)

peopleSelectionStore.setItems(['person.jpg'])

const App = observer((): JSX.Element => {
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
              component={HomeScreen}
            />

            <Stack.Screen
              name="Person"
              component={PersonSelectionScreen}
            />

            <Stack.Screen
              name="Clothes"
              component={GarmentSelectionScreen}
            />

            <Stack.Screen
              name="Result"
              component={ResultScreen}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
})

export default App;
