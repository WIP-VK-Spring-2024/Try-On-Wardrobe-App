import React from 'react';
import {Image, Box, Pressable, View} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';
import {BASE_COLOR, ADD_BTN_COLOR, FOOTER_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../consts';
import { ImageSourcePropType} from 'react-native';
import AddBtnIcon from '../../assets/icons/add-btn.svg';
import { RobotoText } from './common';

import ImageModal from 'react-native-image-modal';
import { ImageSourceType } from '../utils';

export const CARD_SIZE = {
  height: (((WINDOW_WIDTH - 30) / 2) * 3) / 2,
  width: (WINDOW_WIDTH - 30) / 2,
};

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

interface ListImageProps {
  source: string | ImageSourcePropType
  opacity?: number
}

export const CARD_PROPS = {
  width: CARD_SIZE.width,
  height: CARD_SIZE.height,
  borderRadius: 20,
  backgroundColor: "#ffffff"
}

export const ListImage = observer((props: ListImageProps) => {
    return (
      <Image
        {...props}
        {...CARD_PROPS}
        alt=""
      />
    );
  },
);

export const ModalListImage = observer((props: { source: ImageSourceType }) => {
    return (
      <ImageModal
        {...props}
        style={{
          width: CARD_SIZE.width,
          height: CARD_SIZE.height,
          borderRadius: 20
        }}
      />
    );
  },
);

interface AddItemCardProps {
  text?: string
  onPress?: () => void 
}

export const AddItemCard = observer(
  ({ text, onPress, children } : AddItemCardProps & React.PropsWithChildren) => {
    return (
      <Pressable
        borderRadius={CARD_PROPS.borderRadius}
        backgroundColor={CARD_PROPS.backgroundColor}
        onPress={onPress}
        width={CARD_SIZE.width}
        height={CARD_SIZE.height}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={10}>
        {children ||
          <>
            <AddBtnIcon
              width={45}
              height={45}
              fill={ADD_BTN_COLOR}
              stroke={FOOTER_COLOR}
            />
            <RobotoText fontSize={16}>{text || 'Добавить'}</RobotoText>
          </>
        }
      </Pressable>
    );
  },
);
