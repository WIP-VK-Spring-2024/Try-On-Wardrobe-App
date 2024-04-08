import React from 'react';
import { BaseList, ListImage, AddItemCard } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType } from 'react-native';
import { BASE_COLOR, WINDOW_HEIGHT } from '../consts';

import { observer } from 'mobx-react-lite';
import { userPhotoSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { createUserPhotoFromGallery } from '../requests/imageCreation'

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
        h={WINDOW_HEIGHT / 3}>
        <ListImage source={source} />
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
    ))
  
    people.unshift(<AddItemCard text="Новое фото для примерки" onPress={async () => {
        const created = await createUserPhotoFromGallery();
        if (!created) {
          console.log('user photo not created')
        }
      }}/>)
  
    return <BaseList items={people} />
  })
