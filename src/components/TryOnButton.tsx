import React from "react";
import { Fab } from "@gluestack-ui/themed";
import HangerIcon from "../../assets/icons/hanger.svg";
import { observer } from "mobx-react-lite"
import { EXTRA_COLOR } from "../consts";
import { tryOnScreenGarmentSelectionStore } from "../store"
import { GarmentCard } from "../stores/GarmentStore";
import { RobotoText } from "./common"
import { outfitStore } from "../stores/OutfitStore";

interface TryOnButtonProps {
  outfitId?: string
  garments?: GarmentCard[]
  navigation: any
  marginBottom?: number
  nextScreen?: string
  nextScreenParams?: any
}

export const TryOnButton = observer(
  ({
    outfitId,
    garments,
    navigation,
    marginBottom,
    nextScreen,
    nextScreenParams,
  }: TryOnButtonProps) => {
  
  garments = garments?.filter(garment => garment.tryOnAble);

  return (
    <Fab
      size="sm"
      placement="bottom right"
      marginBottom={marginBottom}
      right={10}
      bgColor={EXTRA_COLOR}
      gap={5}
      isDisabled={garments ? garments.length < 1 : outfitId === undefined}
      onPress={() => {
        tryOnScreenGarmentSelectionStore.clearSelectedItems();

        garments?.forEach(garment => tryOnScreenGarmentSelectionStore.select(garment));
        
        outfitId && outfitStore.outfits.find(outfit => outfit.uuid === outfitId)?.setTryOnResult(undefined);

        navigation.navigate('TryOn/Person', {
          outfitId: outfitId,
          next: nextScreen,
          params: nextScreenParams,
        });
      }}>
      <HangerIcon width={20} height={20} />
      <RobotoText color="#ffffff" fontSize={16}>
        Примерить
      </RobotoText>
    </Fab>
  );
});
