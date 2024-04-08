import React from 'react';
import {Image, Box, Pressable} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';
import {BASE_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../consts';
import { ImageSourcePropType} from 'react-native';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import { RobotoText } from './common';


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

interface BaseListProps {
    items: any
    addItemCard?: React.ReactNode
}

export const BaseList = observer((props: BaseListProps) => {
    const getItemsWithAddItemCard = () => {
        if (props.addItemCard === undefined) {
            return props.items;
        }
        return [props.addItemCard, ...props.items];
    }

    const pairs = divideIntoPairs(getItemsWithAddItemCard());
    return (
        <Box
            bg={BASE_COLOR}
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

export const ListImage = observer((props: { source: string | ImageSourcePropType }) => {
    return (
      <Image {...props} 
              width={(WINDOW_WIDTH - 30) / 2} 
              height={(WINDOW_WIDTH - 30) / 2 * 3 / 2} 
              alt="" 
              borderRadius={20}
              backgroundColor='#ffffff'
        />
    );
  });

export const AddItemCard = observer(
    ({text, onPress}: {text: string; onPress: () => void}) => {
        return (
            <Pressable
                borderRadius={20}
                backgroundColor='#ffffff'
                onPress={onPress}
                w="49%"
                h={WINDOW_HEIGHT / 3}>
                <Box h="100%" w="100%" display="flex" flexDirection="row" alignItems='center'>
                    <AddBtnIcon width={50} height={50}></AddBtnIcon>
                    <RobotoText fontSize={16}>{text}</RobotoText>
                </Box>
            </Pressable>
        );
    },
);
