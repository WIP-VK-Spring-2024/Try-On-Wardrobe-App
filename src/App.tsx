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
import { GarmentList } from './components/GarmentList';
import { Header } from './components/Header';
import { RobotoText } from './components/common';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BaseScreen } from './components/base';
import { active_color, windowHeight, windowWidth } from './consts';
import { endpoint } from '../config';

import { selectionStore } from './store';
import { observer } from 'mobx-react-lite';

export const Stack = createNativeStackNavigator();

const GarmentScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <BaseScreen navigation={navigation}>
      <GarmentList/>
    </BaseScreen>
  )
})

const AnotherScreen = observer(({navigation}: {navigation: any}) => {
  const customFooter = (
      <Pressable 
        onPress={()=>navigation.navigate('Result')} 
        bgColor={active_color} h={65}
      >
        <Center>
          <Text color="white" fontSize="$3xl">Выбрать</Text>
        </Center>
      </Pressable>
    )
  
  return (
    <BaseScreen navigation={navigation} footer={customFooter}>
      <RobotoText>Another page</RobotoText>
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
      selectionStore.setItems(data.map((el: any) => el.Image))
      console.log(selectionStore.items)
    }
  )
)

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
              component={GarmentScreen}
            />

            <Stack.Screen
              name="Another"
              component={AnotherScreen}
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
