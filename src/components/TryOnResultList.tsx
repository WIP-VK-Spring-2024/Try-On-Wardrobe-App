import React from 'react';
import { BaseList, AddItemCard, CARD_SIZE, ModalListImage, ListImage } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { observer } from 'mobx-react-lite';
import { tryOnStore } from '../stores/TryOnStore';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { getImageSource } from '../utils';
import { Rating } from '../stores/common';

const style = StyleSheet.create({
    overlay: {
      position: 'absolute',
      bottom: 5,
    },
  });

const TryOnResultCard = observer(
    ({
        source,
        onPress,
        uuid,
        rating
    }: {
        source: string | ImageSourcePropType;
        onPress: () => void;
        uuid: string;
        rating: Rating;
    }) => {
        return (
            <Pressable
                borderRadius={20}
                backgroundColor="#ffffff"
                onPress={onPress}
                w="49%"
                h={CARD_SIZE.height}>
                <ListImage source={source} />
            </Pressable>
        );
    },
);

export const TryOnResultList = observer(({navigation}: {navigation: any}) => {
    const cards = tryOnStore.results.map((item) => (
        <TryOnResultCard
            source={getImageSource(item.image)}
            onPress={()=>{
              navigation.navigate('TryOnCard', {tryOnResult: item});
            }}
            // onPress={() => {}}
            uuid={item.uuid}
            rating={item.rating}
        />
    ));

    cards.unshift(<AddItemCard text="Новая примерка" onPress={() => navigation.navigate('Person')}/>)

    return <BaseList items={cards} />;
});
