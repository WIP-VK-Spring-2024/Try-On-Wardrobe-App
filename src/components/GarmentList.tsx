import React from 'react';
import { BaseList } from './BaseList';
import { Image, Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { base_color, windowHeight, windowWidth } from '../consts';

import SelectedIcon from '../../assets/icons/selected.svg';
import { observer } from 'mobx-react-lite';
import { garmentScreenGarmentSelectionStore, tryOnScreenGarmentSelectionStore, userPhotoSelectionStore } from '../store';

import { getImageSource } from '../utils';

const ListImage = observer((props: { source: string | ImageSourcePropType, uuid: string }) => {
  return (
    <Image {...props} 
            width={(windowWidth - 30) / 2} 
            height={(windowWidth - 30) / 2 * 3 / 2} 
            alt="" 
            borderRadius={20}
            backgroundColor='#ffffff'
      />
  );
});

const style = StyleSheet.create({
  overlay: {
    width: 3,
    height: 3,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});

const ClothesListCard = observer(
  ({ source, selected, id, onPress }:
    { source: string | ImageSourcePropType, selected: boolean, id: number, onPress: ()=>void }
  ) => {
    const overlaySize = windowWidth / 4;

    return (
      <Pressable
        bg={base_color}
        onPress={onPress}
        w="49%" h={windowHeight / 3}
      >
        <Image source={source} w="100%" h="100%" alt="" />
        {selected && <SelectedIcon
          // position='absolute'
          style={style.overlay}
          width={overlaySize}
          height={overlaySize}
          color="blue"
        />
        }
      </Pressable>)
  })

const PersonListCard = observer(
  ({ source, selected, id }:
    { source: string | ImageSourcePropType, selected: boolean, id: number }
  ) => {
    const overlaySize = windowWidth / 4;

    return (
      <Pressable
        bg={base_color}
        onPress={() => userPhotoSelectionStore.toggle(id)}
        w="49%" h={windowHeight / 3}
      >
        <Image source={source} w="100%" h="100%" alt="" />
        {selected && <SelectedIcon
          // position='absolute'
          style={style.overlay}
          width={overlaySize}
          height={overlaySize}
          color="blue"
        />
        }
      </Pressable>)
  })



export const StaticGarmentList = observer((props: any) => {
  const clothes = garmentScreenGarmentSelectionStore.items.map((item, i) => (
    <Pressable
      onPress={()=>{
        garmentScreenGarmentSelectionStore.select(i);
        props.navigation.navigate('Garment');
      }}
    >
      <ListImage
        source={getImageSource(item.image)}
        uuid={item.uuid}
      />
    </Pressable>
  ))

  return <BaseList items={clothes} />
})

export const GarmentList = observer((props: any) => {
  const clothes = tryOnScreenGarmentSelectionStore.items.map((item, i) => (
    <ClothesListCard
      source={getImageSource(item.image)}
      selected={i === tryOnScreenGarmentSelectionStore.selectedItemId}
      id={i}
      onPress={() => tryOnScreenGarmentSelectionStore.toggle(i)}
    />
  ))

  return <BaseList items={clothes} />
})

export const PeopleList = observer((props: any) => {
  const clothes = userPhotoSelectionStore.items.map((item, i) => (
    <PersonListCard
      source={getImageSource(item.image)}
      selected={i === userPhotoSelectionStore.selectedItemId}
      id={i}
    />
  ))

  return <BaseList items={clothes} />
})
