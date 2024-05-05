import React, { useState } from 'react';

import Animated, { ZoomInEasyDown, ZoomOutEasyDown } from 'react-native-reanimated';

import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { ACTIVE_COLOR } from '../consts';
import { Box, Text } from '@gluestack-ui/themed';
import { Pressable, View } from '@gluestack-ui/themed';
import { createGarmentFromCamera, createGarmentFromGallery } from '../requests/imageCreation';
import { RobotoText } from './common';
import { appState } from '../stores/AppState';

import CameraIcon from '../../assets/icons/camera.svg';
import GalleryIcon from '../../assets/icons/gallery.svg';
import GarmentIcon from '../../assets/icons/garment.svg';
import OutfitIcon from '../../assets/icons/outfit.svg';
import EditorIcon from '../../assets/icons/editor.svg';
import MagicIcon from '../../assets/icons/magic.svg';

import { garmentStore } from '../stores/GarmentStore';
import { SvgProps } from 'react-native-svg';

import { Outfit } from "../stores/OutfitStore"

const floatingStyle = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
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
    shadowColor: '#000000',
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    // gap: 10,
    alignItems: 'center',
    // justifyContent: 'flex-start'
    justifyContent: 'space-between'
  }
});

const menuIconSize = 40;

const iconProps = {
  width: menuIconSize,
  height: menuIconSize,
  fill: ACTIVE_COLOR,
};

const strokeIconProps = {
  width: menuIconSize,
  height: menuIconSize,
  stroke: ACTIVE_COLOR,
};

const menuEntryFontSize = 18;

type Step = 'main' | 'garment' | 'outfit';

interface MenuItemProps {
  text: string
  onPress: () => void
  Icon: React.FC<SvgProps>
  stroke?: boolean
  fontSize?: number
  iconSize?: number
}

export const MenuItem = observer(({text, onPress, Icon, stroke, fontSize, iconSize} : MenuItemProps) => {
  const props = stroke ? strokeIconProps : iconProps;

  return (
    <Pressable
      // style={floatingStyle.menuItem}
      flexDirection='row'
      alignItems='center'
      onPress={onPress}
      // flex={1}
    >
      <View
        // width={35}
        // height={35}
        // flex={1}
      >
        <Icon {...props}/>
        {/* <RobotoText>kek</RobotoText> */}
      </View>
      
      <View
        flexShrink={1}
      >
        <Text
          flexShrink={1}
          fontSize={fontSize || menuEntryFontSize}
          flexWrap="wrap"
        >
          {text}
        </Text>
      </View>
    </Pressable>
)
});

export const AddMenu = observer((props: {navigation: any}) => {
  const openCreatedGarment = () => {
    props.navigation.navigate('Garment', {garment: garmentStore.garments[0]});   
  }

  const [step, setStep] = useState<Step>('main');

  const MenuBackButton = () => (
    <Pressable onPress={() => setStep('main')}>
      <RobotoText textAlign="center" fontSize={menuEntryFontSize}>
        Назад
      </RobotoText>
    </Pressable>
  );

  return (
    <Animated.View
      style={floatingStyle.container}
      entering={ZoomInEasyDown.duration(250)}
      exiting={ZoomOutEasyDown.duration(250)}>
      <Box style={floatingStyle.menu}>
        {step === 'main' && (
          <>
            <MenuItem
              onPress={() => setStep('garment')}
              Icon={GarmentIcon}
              text="Добавить одежду"
              stroke={true}
            />
            <MenuItem
              onPress={() => setStep('outfit')}
              Icon={OutfitIcon}
              text="Создать образ"
              stroke={true}
            />
          </>
        )}

        {step === 'garment' && (
          <View gap={10}>
            <MenuItem
              onPress={async () => {
                const created = await createGarmentFromGallery();
                if (created) {
                  openCreatedGarment();
                }
              }}
              Icon={GalleryIcon}
              text="Из галереи"
            />

            <MenuItem
              onPress={async () => {
                const created = await createGarmentFromCamera();
                if (created) {
                  openCreatedGarment();
                }
              }}
              Icon={CameraIcon}
              text="Сфотографировать"
            />

            <MenuBackButton />
          </View>
        )}

        {step === 'outfit' && (
          <View gap={10}>
            <MenuItem
              onPress={() => {
                const newOutfit = new Outfit();
                props.navigation.navigate('Outfit/Garment', {outfit: newOutfit});
                appState.setCreateMenuVisible(false);
              }}
              Icon={EditorIcon}
              text="Создать вручную"
            />

            <MenuItem
              onPress={() => {
                props.navigation.navigate('OutfitGenForm');
                appState.setCreateMenuVisible(false);
              }}
              Icon={MagicIcon}
              text="С помощью ИИ"
            />

            <MenuBackButton />
          </View>
        )}
      </Box>
    </Animated.View>
  );
})
