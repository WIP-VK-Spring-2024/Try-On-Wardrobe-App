import React from 'react';

import Animated from 'react-native-reanimated';
import { BounceInDown, BounceOutDown } from 'react-native-reanimated';

import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { SECONDARY_COLOR } from '../consts';
import { Box } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { createGarmentFromCamera, createGarmentFromGallery, createUserPhotoFromGallery } from '../requests/imageCreation';
import { RobotoText } from './common';

import CameraIcon from '../../assets/icons/camera.svg';
import GalleryIcon from '../../assets/icons/gallery.svg';
import { garmentStore } from '../stores/GarmentStore';

export const AddMenu = observer((props: {navigation: any}) => {
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
    fill: SECONDARY_COLOR
  };

  const openCreatedGarment = () => {
    props.navigation.navigate('Garment', {garment: garmentStore.garments[garmentStore.garments.length - 1]});   
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
              console.log('user photo not created')
            }
          }}
        >
          <GalleryIcon {...iconProps}/>
          <RobotoText fontSize={24}>Ваше фото</RobotoText>
        </Pressable>
      </Box>
    </Animated.View>
  )
})
