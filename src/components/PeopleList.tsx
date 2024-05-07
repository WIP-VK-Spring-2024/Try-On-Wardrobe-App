import React from 'react';
import { BaseList, ListImage, AddItemCard, CARD_SIZE } from './BaseList';
import { Pressable } from '@gluestack-ui/themed';
import { ImageSourcePropType } from 'react-native';
import { BASE_COLOR, DELETE_BTN_COLOR } from '../consts';

import { observer } from 'mobx-react-lite';
import { userPhotoSelectionStore } from '../store';

import { getImageSource } from '../utils';
import { createUserPhotoFromGallery } from '../requests/imageCreation'

import TrashIcon from "../../assets/icons/trash.svg"
import { appState } from '../stores/AppState';
import { UserPhoto } from '../stores/UserPhotoStore';

interface PersonListCardProps {
  source: string | ImageSourcePropType;
  id: number;
  onDelete: () => void;
  onPress: () => void;
}

const PersonListCard = observer(
  ({ source, id, onDelete, onPress }: PersonListCardProps) => {
    return (
      <Pressable
        key={id}
        bg={BASE_COLOR}
        onPress={() => onPress()}
        w={CARD_SIZE.width}
        h={CARD_SIZE.height}>
        <ListImage source={source} />
        <Pressable position='absolute' top={8} right={8} onPress={onDelete}>
          <TrashIcon width={25} height={25} fill="#000000"/>
        </Pressable>
      </Pressable>
    );
  },
);

interface PeopleListProps {
  navigation: any
  onItemDelete: (item: UserPhoto) => void
  onPress: () => void
}

export const PeopleList = observer(({onItemDelete, onPress}: PeopleListProps) => {
    const people = userPhotoSelectionStore.items.map((item, i) => (
      <PersonListCard
        key={i}
        onPress={() => {
          userPhotoSelectionStore.select(i);
          onPress();
        }}
        source={getImageSource(item.image)}
        id={i}
        onDelete={() => onItemDelete(item)}
      />
    ));
  
    people.unshift(<AddItemCard key="add" text="Новое фото для примерки" onPress={async () => {
        const created = await createUserPhotoFromGallery();
        if (!created) {
          console.log('user photo not created')
        }
      }}/>);
  
    return <BaseList items={people} />;
  })
