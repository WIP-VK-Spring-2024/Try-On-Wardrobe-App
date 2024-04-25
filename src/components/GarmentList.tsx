import React, { useEffect, useState } from 'react';
import { BaseList, CARD_SIZE, CARD_PROPS, ListImage } from './BaseList';
import { Pressable, View } from '@gluestack-ui/themed';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { BASE_COLOR, ACTIVE_COLOR, WINDOW_WIDTH, PRIMARY_COLOR } from '../consts';

import SelectedIcon from '../../assets/icons/selected.svg';

import { observer } from 'mobx-react-lite';
import { garmentScreenGarmentSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { MultipleSelectionStore, SingleSelectionStore } from '../stores/SelectionStore';
import { GARMENT_TYPE_DRESS, GARMENT_TYPE_LOWER, GARMENT_TYPE_UPPER, GarmentCard, GarmentType } from '../stores/GarmentStore';
import { RobotoText } from './common';
import { tryOnValidationStore } from '../stores/TryOnStore';

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
  onPress: () => void;
}

const ClothesListCard = observer(
  ({
    source,
    selected,
    onPress,
  } : ClothesListCardProps) => {
    return (
      <Pressable bg={BASE_COLOR} onPress={onPress} w="49%" h={CARD_SIZE.height}>
        <ListImage source={source} />

        {selected && (
          <SelectedIcon
            fill={ACTIVE_COLOR}
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

interface DisableableClothesListCardProps extends ClothesListCardProps {
  disabled: boolean
  info?: JSX.Element
}

const DisableableClothesListCard = observer(
  ({
    source,
    selected,
    onPress,
    disabled,
    info
  } : DisableableClothesListCardProps) => {
    const [infoShown, setInfoShown] = useState(false);

    useEffect(() => {
      if (disabled == false) {
        setInfoShown(false);
      }
    }, [disabled])

    return (
      <Pressable
        bg={BASE_COLOR}
        onPress={() => disabled ? setInfoShown(!infoShown)
                                : onPress()}
        w="49%"
        h={CARD_SIZE.height}>
        {infoShown ? <View {...CARD_PROPS} alignItems='center' justifyContent='center'>{info}</View> 
                   : <ListImage source={source} opacity={disabled ? 0.4 : 1} />}

        {selected && (
          <SelectedIcon
            fill={ACTIVE_COLOR}
            style={style.overlay}
            width={overlaySize}
            height={overlaySize}
          />
        )}

        {disabled && !infoShown && (
          <View {...CARD_PROPS} bgColor='#00000044' position='absolute' />
        )}
      </Pressable>
    );
  },
);

interface DisableableSelectionGarmentListProps {
    store: MultipleSelectionStore<GarmentCard>
    typeStore: SingleSelectionStore<GarmentType>
    disabledPredicate: (item: GarmentCard) => boolean
}

export const DisableableSelectionGarmentList = observer((props: DisableableSelectionGarmentListProps) => {
  const clothes = props.store.items.map((item) => {
    const selected = props.store.selectedItems.includes(item)
    const disabled = !selected && (props.disabledPredicate ? props.disabledPredicate(item) : false);

    const msg = item.type?.name === GARMENT_TYPE_DRESS
              ? 'Вы уже выбрали другие вещи для примерки. Платья невозможно примерять с любыми другими вещами'
              : tryOnValidationStore.selectedTypes.has(GARMENT_TYPE_DRESS)
                  ? 'Вы уже выбрали вещь категории "Платья" для примерки. Платья невозможно примерять с любыми другими вещами'
                  : `При примерке нескольких вещей возможно выбрать только одну вещь категории "${item.type?.name}"`

    const onPress = () => {
      props.store.toggle(item);

      if (!props.store.isSelected(item) || tryOnValidationStore.selectableTypes.size === 0) {
        return;
      }

      switch (item.type?.name) {
        case GARMENT_TYPE_LOWER:
          props.typeStore.selectBy((item) => item.name === GARMENT_TYPE_UPPER);
          break;
        case GARMENT_TYPE_UPPER:
          props.typeStore.selectBy((item) => item.name === GARMENT_TYPE_LOWER);
          break;
        case GARMENT_TYPE_DRESS:
          props.typeStore.selectBy((item) => item.name === GARMENT_TYPE_DRESS);
          break;
      }
    };

    return <DisableableClothesListCard
        source={getImageSource(item.image)}
        selected={selected}
        disabled={disabled}
        onPress={onPress}
        info={<RobotoText>{msg}</RobotoText>}
    />
  })

  return <BaseList items={clothes} />
})
