import React from 'react';
import { BaseList, ListImage, AddItemCard, CARD_SIZE } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType } from 'react-native';
import { BASE_COLOR } from '../consts';

import { observer } from 'mobx-react-lite';
import { userPhotoSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { createUserPhotoFromGallery } from '../requests/imageCreation'

import DotsIcon from "../../assets/icons/dots-vertical.svg"

interface PersonListCardProps {
  source: string | ImageSourcePropType;
  navigation: any;
  id: number;
}

const PersonListCard = observer(
  ({ source, navigation, id }: PersonListCardProps) => {
    return (
      <Pressable
        bg={BASE_COLOR}
        onPress={() => {
          userPhotoSelectionStore.toggle(id);
          navigation.navigate('Clothes');
        }}
        w="49%"
        h={CARD_SIZE.height}>
        <ListImage source={source} />
        <Pressable position='absolute' top={5} right={5}>
          <DotsIcon width={25} height={25}/>
        </Pressable>
      </Pressable>
    );
  },
);

export const PeopleList = observer(({navigation}: {navigation: any}) => {
    const people = userPhotoSelectionStore.items.map((item, i) => (
      <PersonListCard
        navigation={navigation}
        source={getImageSource(item.image)}
        id={i}
      />
    ));
  
    people.unshift(<AddItemCard text="Новое фото для примерки" onPress={async () => {
        const created = await createUserPhotoFromGallery();
        if (!created) {
          console.log('user photo not created')
        }
      }}/>);
  
    return <BaseList items={people} />;
  })
