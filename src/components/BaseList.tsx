import React from 'react';
import {Box} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';
import {base_color, windowHeight} from '../consts';
import {Pressable} from '@gluestack-ui/themed';


const divideIntoPairs = (items: any[]) => {
    let item_pairs = [];
    for (let i = 0; i < items.length; i++) {
        if (i % 2 === 0) {
            item_pairs.push([items[i]]);
        } else {
            item_pairs[item_pairs.length - 1].push(items[i]);
        }
    }

    return item_pairs;
};

export const BaseList = observer((props: {items: any}) => {
    const pairs = divideIntoPairs(props.items);
    return (
        <Box
            bg={base_color}
            display="flex"
            flexDirection="column"
            gap={10}
            padding={10}>
            {pairs.map((item_pair, i) => {
                return (
                    <Box key={i} display="flex" flexDirection="row" gap={10}>
                        {item_pair[0]}
                        {item_pair[1]}
                    </Box>
                );
            })}
        </Box>
    );
});

export const AddItemCard = observer(
    ({text, onPress}: {text: string; onPress: () => void}) => {
        return (
            <Pressable
                bg={base_color}
                onPress={onPress}
                w="49%"
                h={windowHeight / 3}>
            </Pressable>
        );
    },
);
