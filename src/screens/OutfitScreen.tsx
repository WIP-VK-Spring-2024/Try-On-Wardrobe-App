import React from 'react';
import { BaseScreen } from './base';
import { observer } from 'mobx-react-lite';
import { outfitStore } from '../stores/GarmentKitStore';
import { Pressable } from 'react-native';
import { BaseList, ListImage } from '../components/BaseList';
import { getImageSource } from '../utils';

interface OutfitListProps {
  navigation: any
}

export const OutfitList = observer((props: OutfitListProps) => {
  const outfits = outfitStore.outfits.map((outfit, i) => (
    <Pressable
      key={i}
      onPress={()=>{
        props.navigation.navigate('GarmentKit', {outfit: outfit});
      }}
    >
      {
        outfit.image && <ListImage
          source={getImageSource(outfit.image)}
        />
      }
    </Pressable>
  ))

  return <BaseList items={outfits} />
});

interface OutfitSelectionScreenProps {
  navigation: any
}

export const OutfitSelectionScreen = observer((props: OutfitSelectionScreenProps) => {
  return (
    <BaseScreen
      navigation={props.navigation}
    >
      <OutfitList navigation={props.navigation}/>
    </BaseScreen>
  )
});
