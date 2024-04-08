import React from 'react';
import {Box, Button, Center, Pressable} from '@gluestack-ui/themed';
import {ACTIVE_COLOR, ADD_BTN_COLOR, TEXT_COLOR, FOOTER_COLOR, FOOTER_ICON_COLOR, WINDOW_WIDTH} from '../consts';
import { useRoute } from '@react-navigation/native';

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';

import { observer } from 'mobx-react-lite';
import { SvgProps } from 'react-native-svg'
import { RobotoText } from './common';
import { appState } from '../stores/AppState';

interface NavigationButtonProps {
  Icon: React.FC<SvgProps>;
  size: number;
  text: string;
  navigation?: any;
  targetScreen: string;
  route: any;
}

const NavigationButton = observer(
  ({
    Icon,
    size,
    text,
    navigation,
    targetScreen,
    route
  } : NavigationButtonProps) => {
    return (
      <Pressable
          onPress={() => navigation?.navigate(targetScreen)}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="16%"
          paddingBottom={5}>
          <Icon
            stroke={FOOTER_ICON_COLOR}
            width={size}
            height={size}
            fill={route.name === targetScreen ? ACTIVE_COLOR : FOOTER_COLOR}
          />
          <RobotoText color={TEXT_COLOR} fontSize={size / 4}>
            {text}
          </RobotoText>
      </Pressable>
    );
  },
);

export const Footer = observer(({navigation}: {navigation: any}) => {
  const normalSize = WINDOW_WIDTH / 8;
  const addBtnSize = normalSize + 20;

  const route = useRoute();

  return (
    <Box
      bg={FOOTER_COLOR}
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center"
      paddingHorizontal={5}
      // paddingBottom={3}
      >

      <NavigationButton
        Icon={NewsPaperIcon}
        targetScreen=''
        route={route}
        size={normalSize}
        text='Лента'
      />

      <NavigationButton
        Icon={GarmentIcon}
        targetScreen='Home'
        route={route}
        navigation={navigation}
        size={normalSize}
        text='Одежда'
      />

      <AddBtnIcon
        stroke={ADD_BTN_COLOR}
        width={addBtnSize}
        height={addBtnSize}
        onPress={() => appState.toggleCreateMenuVisible()}
      />

      <NavigationButton
        Icon={OutfitIcon}
        targetScreen=''
        route={route}
        size={normalSize}
        text='Образы'
      />

      <NavigationButton
        Icon={HangerIcon}
        targetScreen='TryOn'
        route={route}
        navigation={navigation}
        size={normalSize}
        text='Примерка'
      />
    </Box>
  );
});

export const ButtonFooter = observer(({text, onPress}: {text?: string, onPress: () => void}) => {
  return (
    <Button onPress={() => onPress()} bgColor={ACTIVE_COLOR} h={65}>
      <Center>
        <RobotoText color="white" fontSize="$3xl">
          {text || 'Выбрать'}
        </RobotoText>
      </Center>
    </Button>
  );
});
