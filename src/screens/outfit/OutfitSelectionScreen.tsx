import React, { useState } from 'react';
import { BaseScreen } from '../BaseScreen';
import { observer } from 'mobx-react-lite';
import { Pressable } from 'react-native';
import { AddItemCard, BaseList, ListImage } from '../../components/BaseList';
import { getImageSource } from '../../utils';
import { Outfit, outfitStore } from '../../stores/OutfitStore';
import { Header } from '../../components/Header';
import { MenuItem } from '../../components/AddMenu';
import { FilterModal } from '../../components/FilterModal'
import { outfitScreenStyleSelectionStore, outfitScreenTagsSelectionStore } from '../../store';

import EditorIcon from '../../../assets/icons/editor.svg';
import MagicIcon from '../../../assets/icons/magic.svg';

import { View } from '@gluestack-ui/themed'

interface OutfitListProps {
  navigation: any
}

const creationMenuItemsFontSize = 16;

const AddOutfitCard = (props: {navigation: any}) => {
  return (
    <AddItemCard>
      <View gap={10}>
        <MenuItem
          onPress={() => {
            const newOutfit = new Outfit();
            props.navigation.navigate('Outfit/Garment', {
              outfit: newOutfit,
            });
          }}
          Icon={EditorIcon}
          text="Создать вручную"
          fontSize={creationMenuItemsFontSize}
        />

        <MenuItem
          onPress={() => {
            props.navigation.navigate('OutfitGenForm');
          }}
          Icon={MagicIcon}
          text="С помощью ИИ"
          fontSize={creationMenuItemsFontSize}
        />
      </View>
    </AddItemCard>
  );
};

export const OutfitList = observer((props: OutfitListProps) => {
  const outfits = outfitStore.outfits.map((outfit, i) => (
    <Pressable
      key={i}
      onPress={()=>{
        props.navigation.navigate('Outfit', {outfit: outfit});
      }}
    >
      {
        outfit.image && <ListImage
          source={getImageSource(outfit.image)}
        />
      }
    </Pressable>
  ))

  return <BaseList items={outfits} addItemCard={<AddOutfitCard navigation={props.navigation}/>}/>
});

interface OutfitSelectionScreenProps {
  navigation: any
}

export const OutfitSelectionScreen = observer((props: OutfitSelectionScreenProps) => {
  const header = <Header navigation={props.navigation} rightMenu={null} /> 

  return (
    <>
      <BaseScreen
        navigation={props.navigation}
        screen="OutfitSelection"
        header={header}
      >
        <OutfitList navigation={props.navigation}/>
      </BaseScreen>

      <FilterModal
        styleSelectionStore={outfitScreenStyleSelectionStore}
        tagsSelectionStore={outfitScreenTagsSelectionStore}
      />
  </>
  )
});
