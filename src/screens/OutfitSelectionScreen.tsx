import React from 'react';
import { BaseScreen } from './BaseScreen';
import { observer } from 'mobx-react-lite';
import { Pressable } from 'react-native';
import { AddItemCard, BaseList, ListImage } from '../components/BaseList';
import { getImageSource } from '../utils';
import { outfitStore } from '../stores/OutfitStore';

interface OutfitListProps {
  navigation: any
}

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

  const addOutfitCard = (
    <AddItemCard
      text="Новый образ"
      onPress={() => {

        outfitStore.addOutfit();
        const newOutfit = outfitStore.outfits[outfitStore.outfits.length - 1];
        props.navigation.navigate('Outfit', {outfit: newOutfit});
      }}
    />
  )

  return <BaseList items={outfits} addItemCard={addOutfitCard}/>
});

interface OutfitSelectionScreenProps {
  navigation: any
}

export const OutfitSelectionScreen = observer((props: OutfitSelectionScreenProps) => {
  return (
    <BaseScreen
      navigation={props.navigation}
      screen="OutfitSelection"
    >
      <OutfitList navigation={props.navigation}/>
    </BaseScreen>
  )
});
