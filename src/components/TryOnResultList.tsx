import React from 'react';
import { BaseList, AddItemCard, ListImage } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { BASE_COLOR, WINDOW_HEIGHT } from '../consts';
import { observer } from 'mobx-react-lite';
import { tryOnStore, Rating } from '../stores/TryOnStore';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { getImageSource } from '../utils';
import { RatingButtons } from './TryOnRating';

const style = StyleSheet.create({
    overlay: {
      position: 'absolute',
    //   right: 5,
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
                bg={BASE_COLOR}
                onPress={onPress}
                w="49%"
                h={WINDOW_HEIGHT / 3}>
                <ListImage source={source} />
                <RatingButtons
                    style={style.overlay}
                    buttonWidth={50}
                    buttonHeight={50}
                    uuid={uuid}
                    rating={rating} />
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

    console.log("try on image paths", tryOnStore.results.map((item) => item.image.uri))
    
    cards.unshift(<AddItemCard text="Новая примерка" onPress={() => navigation.navigate('Person')}/>)

    return <BaseList items={cards} />;
});
