import React from 'react';
import {Box, Button, Center, Pressable, View} from '@gluestack-ui/themed';
import {PRIMARY_COLOR, SECONDARY_COLOR, ADD_BTN_COLOR, TEXT_COLOR, FOOTER_COLOR, FOOTER_ICON_COLOR, WINDOW_WIDTH, ACTIVE_COLOR, BASE_COLOR} from '../consts';

import NewsPaperIcon from '../../assets/icons/paper.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import HangerIcon from '../../assets/icons/hanger.svg';

import { observer } from 'mobx-react-lite';
import { SvgProps } from 'react-native-svg'
import { RobotoText } from './common';
import { appState, Screen } from '../stores/AppState';

interface NavigationButtonProps {
  Icon: React.FC<SvgProps>;
  size: number;
  text: string;
  navigation?: any;
  targetScreen: Screen;
  paddingTop?: number;
}

const NavigationButton = observer(
  ({
    Icon,
    size,
    text,
    navigation,
    targetScreen,
    paddingTop
  } : NavigationButtonProps) => {
    const color = appState.screen === targetScreen ? ACTIVE_COLOR : FOOTER_ICON_COLOR;

    return (
      <Pressable
          onPress={() => navigation?.navigate(targetScreen)}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="16%"
          paddingBottom={5}>
          <View paddingTop={paddingTop || 0}>
            <Icon
              stroke={color}
              fill={color}
              width={size}
              height={size}
            />
          </View>
          <RobotoText color={TEXT_COLOR} fontSize={size / 4}>
            {text}
          </RobotoText>
      </Pressable>
    );
  },
);

export const Footer = observer(({navigation}: {navigation: any}) => {
  const normalSize = WINDOW_WIDTH / 8;
  const addBtnSize = normalSize + 10;

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
        targetScreen='Feed'
        text='Лента'
        size={normalSize}
      />

      <NavigationButton
        Icon={GarmentIcon}
        targetScreen='Home'
        text='Одежда'
        navigation={navigation}
        size={normalSize}
      />

      <AddBtnIcon
        fill={ADD_BTN_COLOR}
        stroke={FOOTER_COLOR}
        width={addBtnSize}
        height={addBtnSize}
        onPress={() => appState.toggleCreateMenuVisible()}
      />

      <NavigationButton
        Icon={OutfitIcon}
        targetScreen='OutfitSelection'
        text='Образы'
        navigation={navigation}
        size={normalSize}
      />

      <NavigationButton
        Icon={HangerIcon}
        targetScreen='TryOn'
        text='Примерка'
        navigation={navigation}
        size={normalSize - 5}
        paddingTop={5}
      />
    </Box>
  );
});

interface ButtonFooterProps {
  text?: string;
  onPress: () => void;
}

export const ButtonFooter = observer(({text, onPress, children}: ButtonFooterProps & React.PropsWithChildren) => {
  return (
    <Button paddingHorizontal={0} onPress={onPress} bgColor={SECONDARY_COLOR} h={65} w="100%" justifyContent="center">
      <Center>
        <RobotoText color="white" fontSize="$3xl">
          {text || 'Выбрать'}
        </RobotoText>
      </Center>
      {children}
    </Button>
  );
});
