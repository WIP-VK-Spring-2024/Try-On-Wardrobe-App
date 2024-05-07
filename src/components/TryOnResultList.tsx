import React from 'react';
import { BaseList, AddItemCard, ListImage, CARD_PROPS } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { observer } from 'mobx-react-lite';
import { tryOnStore } from '../stores/TryOnStore';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { getImageSource } from '../utils'

const TryOnResultCard = observer(
  ({
    source,
    onPress,
  }: {
    source: string | ImageSourcePropType;
    onPress: () => void;
  }) => {
    return (
      <Pressable onPress={onPress}>
        <ListImage source={source} />
      </Pressable>
    );
  },
);

export const TryOnResultList = observer(
  ({ navigation }: { navigation: any }) => {
    const cards = tryOnStore.results.map((item, i) => (
      <TryOnResultCard
        key={i}
        source={getImageSource(item.image)}
        onPress={() => navigation.navigate('TryOnCard', { tryOnResult: item })}
      />
    ));

    cards.unshift(
      <AddItemCard
        key="add"
        text="Новая примерка"
        onPress={() => navigation.navigate('TryOn/Clothes')}
      />,
    );

    return <BaseList items={cards} />;
  },
);
