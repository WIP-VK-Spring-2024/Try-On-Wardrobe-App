import React from 'react';
import { BaseScreen } from '../BaseScreen';
import { observer } from 'mobx-react-lite';
import { Pressable } from 'react-native';
import { AddItemCard, BaseList, ListImage } from '../../components/BaseList';
import { getImageSource } from '../../utils';
import { Outfit, outfitStore } from '../../stores/OutfitStore';
import { Header } from '../../components/Header';
import { FilterModal } from '../../components/FilterModal'
import { outfitScreenStyleSelectionStore, outfitScreenTagsSelectionStore } from '../../store';

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
        const newOutfit = new Outfit();
        props.navigation.navigate('Outfit/Garment', {outfit: newOutfit});
      }}
    />
  )

  return <BaseList items={outfits} addItemCard={addOutfitCard}/>
});

interface OutfitSelectionScreenProps {
  navigation: any
}

export const OutfitSelectionScreen = observer((props: OutfitSelectionScreenProps) => {
  const header = <Header rightMenu={null} /> 

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
