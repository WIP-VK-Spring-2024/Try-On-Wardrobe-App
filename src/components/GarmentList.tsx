import React from 'react';
import { BaseList, CARD_SIZE, ListImage } from './BaseList';
import { Pressable, View } from '@gluestack-ui/themed';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { BASE_COLOR, PRIMARY_COLOR, ACTIVE_COLOR, WINDOW_WIDTH } from '../consts';

import SelectedIcon from '../../assets/icons/selected.svg';
import InfoIcon from '../../assets/icons/info.svg';

import { observer } from 'mobx-react-lite';
import { garmentScreenGarmentSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { MultipleSelectionStore } from '../stores/SelectionStore';
import { GarmentCard } from '../stores/GarmentStore';

const style = StyleSheet.create({
  overlay: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

const overlaySize = WINDOW_WIDTH / 10;

interface ClothesListCardProps {
  source: string | ImageSourcePropType;
  selected: boolean;
  disabled?: boolean;
  disabledOverlay?: JSX.Element
  onPress: () => void;
}

const ClothesListCard = observer(
  ({
    source,
    selected,
    onPress,
    disabledOverlay,
    disabled
  } : ClothesListCardProps) => {
    return (
      <Pressable bg={BASE_COLOR} onPress={onPress} w="49%" h={CARD_SIZE.height}>
        <ListImage source={source} opacity={disabled ? 0.4 : 1} />

        {selected && (
          <SelectedIcon
            fill={ACTIVE_COLOR}
            style={style.overlay}
            width={overlaySize}
            height={overlaySize}
          />
        )}

        {disabled && (
          <View style={style.overlay} width={overlaySize} height={overlaySize}>
            {disabledOverlay}
          </View>
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

interface DisableableSelectionGarmentListProps {
    store: MultipleSelectionStore<GarmentCard>
    disabledPredicate: (item: GarmentCard) => boolean
    onPress?: (item: GarmentCard, disabled: boolean) => void
}




export const DisableableSelectionGarmentList = observer((props: DisableableSelectionGarmentListProps) => {
  const clothes = props.store.items.map((item) => {
    const selected = props.store.selectedItems.includes(item)
    const disabled = !selected && (props.disabledPredicate ? props.disabledPredicate(item) : false);

    const onPress = props.onPress ? () => props.onPress!(item, disabled)
                                  : () => !disabled ? props.store.toggle(item) : undefined

    const disabledOverlay =
      <Pressable onPress={onPress}>
        <InfoIcon
          fill={ACTIVE_COLOR}
          width={overlaySize}
          height={overlaySize}
        />
      </Pressable>

    return <ClothesListCard
        source={getImageSource(item.image)}
        selected={selected}
        disabled={disabled}
        disabledOverlay={disabledOverlay}
        onPress={onPress}
    />
  })

  return <BaseList items={clothes} />
})
