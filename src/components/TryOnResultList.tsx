import React from 'react';
import { BaseList, AddItemCard, CARD_SIZE, ModalListImage, ListImage } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { observer } from 'mobx-react-lite';
import { tryOnStore } from '../stores/TryOnStore';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { getImageSource } from '../utils';
import { Rating } from '../stores/common';
import ImageModal from 'react-native-image-modal';
import { BASE_COLOR } from '../consts';

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
                w={CARD_SIZE.width}
                h={CARD_SIZE.height}>
                <ListImage source={source} />
            </Pressable>
        );
    },
);

export const TryOnResultList = observer(({navigation}: {navigation: any}) => {
    const cards = tryOnStore.results.map((item, i) => (
        <ImageModal
            key={i}
            source={getImageSource(item.image)}
            overlayBackgroundColor={BASE_COLOR + 'a0'}
            style={{
                width: CARD_SIZE.width,
                height: CARD_SIZE.height,
                backgroundColor: "#ffffff",
                borderRadius: 20,
            }}
            resizeMode="contain"
        />
    ));

    cards.unshift(<AddItemCard key="add" text="Новая примерка" onPress={() => navigation.navigate('TryOn/Clothes')}/>)

    return <BaseList items={cards} />;
});
