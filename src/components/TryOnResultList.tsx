import React from 'react';
import {BaseList, AddItemCard} from './BaseList';
import {Image, Pressable} from '@gluestack-ui/themed';
import {base_color, windowHeight} from '../consts';
import {observer} from 'mobx-react-lite';
import {tryOnStore} from '../stores/TryOnStore';
import {ImageSourcePropType} from 'react-native';
import { getImageSource } from '../utils';

const TryOnResultCard = observer(
    ({
        source,
        onPress,
    }: {
        source: string | ImageSourcePropType;
        onPress: () => void;
    }) => {
        return (
            <Pressable
                bg={base_color}
                onPress={onPress}
                w="49%"
                h={windowHeight / 3}>
                <Image source={source} w="100%" h="100%" alt="bebebe" />
            </Pressable>
        );
    },
);

export const TryOnResultList = observer((props: any) => {
    const cards = tryOnStore.results.map((item, i) => (
        <TryOnResultCard
            source={getImageSource(item.image)}
            onPress={() => {}}
        />
    ));

    console.log(tryOnStore.results)
    
    cards.unshift(<AddItemCard text="Новая примерка" onPress={()=>{}}/>)

    console.log("Rendering %d cards", cards.length)

    return <BaseList items={cards} />;
});
