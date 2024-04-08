import React from 'react';
import { BaseList, ListImage } from './BaseList';
import { Image, Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { BASE_COLOR, PRIMARY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH } from '../consts';

import SelectedIcon from '../../assets/icons/selected.svg';
import { observer } from 'mobx-react-lite';
import { garmentScreenGarmentSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { MultipleSelectionStore } from '../stores/SelectionStore';
import { GarmentCard } from '../stores/GarmentStore';

const style = StyleSheet.create({
  overlay: {
    width: 3,
    height: 3,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});

interface ClothesListCardProps {
  source: string | ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}

const ClothesListCard = observer(
  ({
    source,
    selected,
    onPress,
  } : ClothesListCardProps) => {
    const overlaySize = WINDOW_WIDTH / 4;

    return (
      <Pressable
        bg={BASE_COLOR}
        onPress={onPress}
        w="49%"
        h={WINDOW_HEIGHT / 3}>
        <ListImage source={source} />
        {selected && (
          <SelectedIcon
            stroke={PRIMARY_COLOR}
            style={style.overlay}
            width={overlaySize}
            height={overlaySize}
          />
        )}
      </Pressable>
    );
  },
);

export const StaticGarmentList = observer((props: any) => {
  const clothes = garmentScreenGarmentSelectionStore.items.map((item, i) => (
    <Pressable
      key={i}
      onPress={()=>{
        props.navigation.navigate('Garment', {garment: item});
      }}
    >
      <ListImage
        source={getImageSource(item.image)}
      />
    </Pressable>
  ))

  return <BaseList items={clothes} />
})

interface MultipleSelectionGarmentListProps {
  store: MultipleSelectionStore<GarmentCard>
}

export const MultipleSelectionGarmentList = observer((props: MultipleSelectionGarmentListProps) => {
  const clothes = props.store.items.map((item) => {
    const selected = props.store.selectedItems.includes(item)
    return <ClothesListCard
      source={getImageSource(item.image)}
      selected={selected}
      onPress={() => props.store.toggle(item)}
    />
  })

  return <BaseList items={clothes} />
})
