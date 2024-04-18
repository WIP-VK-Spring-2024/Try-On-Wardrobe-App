import React from 'react';
import { BaseList, CARD_SIZE, ListImage } from './BaseList';
import { Image, Pressable, View } from '@gluestack-ui/themed';
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
    top: 10,
    // bottom: 10,
  },
});

interface ClothesListCardProps {
  source: string | ImageSourcePropType;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const ClothesListCard = observer(
  ({
    source,
    selected,
    onPress,
    disabled
  } : ClothesListCardProps) => {
    const overlaySize = WINDOW_WIDTH / 10;

    return (
      <Pressable
        bg={BASE_COLOR}
        onPress={onPress}
        w="49%"
        h={CARD_SIZE.height}>
        <ListImage source={source} opacity={disabled ? 50 : 100}/>
        {selected && (
          <SelectedIcon
            // stroke={PRIMARY_COLOR}
            fill={PRIMARY_COLOR}
            style={style.overlay}
            width={overlaySize}
            height={overlaySize}
          />
        )}
        {/* {disabled && (
          <View
            position="absolute"
            w="100%"
            h={CARD_SIZE.height}
            borderRadius={20}
            bgColor="#00000077"
          />
        )} */}
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
  disabledPredicate?: (item: GarmentCard) => boolean
}

export const MultipleSelectionGarmentList = observer((props: MultipleSelectionGarmentListProps) => {
  const clothes = props.store.items.map((item) => {
    const selected = props.store.selectedItems.includes(item)
    const disabled = !selected && (props.disabledPredicate ? props.disabledPredicate(item) : false);

    return <ClothesListCard
        source={getImageSource(item.image)}
        selected={selected}
        disabled={disabled}
        onPress={() => !disabled ? props.store.toggle(item) : undefined}
    />
  })

  return <BaseList items={clothes} />
})
