import React from 'react';
import { BaseList, ListImage } from './BaseList';
import { Image, Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { BASE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from '../consts';

import SelectedIcon from '../../assets/icons/selected.svg';
import { observer } from 'mobx-react-lite';
import { garmentScreenGarmentSelectionStore, tryOnScreenGarmentSelectionStore } from '../store';

import { getImageSource } from '../utils';

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
    const overlaySize = WINDOW_WIDTH / 4;

    return (
      <Pressable
        bg={BASE_COLOR}
        onPress={onPress}
        w="49%" h={WINDOW_HEIGHT / 3}
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
  const clothes = tryOnScreenGarmentSelectionStore.items.map((item, i) => {
    const selected = tryOnScreenGarmentSelectionStore.selectedItems.includes(item)
    return <ClothesListCard
      source={getImageSource(item.image)}
      selected={selected}
      id={i}
      onPress={() => tryOnScreenGarmentSelectionStore.toggle(item)}
    />
})

  return <BaseList items={clothes} />
})
