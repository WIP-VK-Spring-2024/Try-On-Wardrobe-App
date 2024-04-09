import React from 'react';
import { BaseList, AddItemCard, ListImage } from './BaseList';
import { Pressable, Image } from '@gluestack-ui/themed';
import { BASE_COLOR, WINDOW_HEIGHT } from '../consts';
import { observer } from 'mobx-react-lite';
import { tryOnStore, Rating } from '../stores/TryOnStore';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { getImageSource } from '../utils';
import { RatingButtons } from './TryOnRating';

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
                h={WINDOW_HEIGHT / 3}>
                <ListImage source={source} />
            </Pressable>
        );
    },
);

export const TryOnResultList = observer(({navigation}: {navigation: any}) => {
    const cards = tryOnStore.results.map((item) => (
        <TryOnResultCard
            source={getImageSource(item.image)}
            onPress={() => {}}
            uuid={item.uuid}
            rating={item.rating}
        />
    ));

    cards.unshift(<AddItemCard text="Новая примерка" onPress={() => navigation.navigate('Person')}/>)

    return <BaseList items={cards} />;
});
