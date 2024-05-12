import React from "react";
import { Fab } from "@gluestack-ui/themed";
import HangerIcon from "../../assets/icons/hanger.svg";
import { observer } from "mobx-react-lite"
import { EXTRA_COLOR } from "../consts";
import { tryOnScreenGarmentSelectionStore } from "../store"
import { GarmentCard } from "../stores/GarmentStore";
import { RobotoText } from "./common"
import { outfitStore } from "../stores/OutfitStore";

type TryOnType = 'garment' | 'outfit' | 'post'

interface TryOnPersonNavigationParams {
  tryOnType: TryOnType
  outfitId?: string
  nextScreen?: string
  nextScreenParams?: any
}

interface TryOnButtonProps extends TryOnPersonNavigationParams {
  garments?: GarmentCard[]
  navigation: any
  placement?: "bottom right" | "bottom left" | "bottom center" | "top right" | "top left" | "top center"
  marginBottom?: number
}

export const TryOnButton = observer(
  ({
    outfitId,
    garments,
    navigation,
    tryOnType,
    marginBottom,
    nextScreen,
    nextScreenParams,
    placement,
  }: TryOnButtonProps) => {
  
  garments = garments?.filter(garment => garment.tryOnAble);

  return (
    <Fab
      size="sm"
      placement={placement || "bottom right"}
      marginBottom={marginBottom}
      right={10}
      bgColor={EXTRA_COLOR}
      gap={5}
      isDisabled={garments ? garments.length < 1 : outfitId === undefined}
      onPress={() => {
        tryOnScreenGarmentSelectionStore.clearSelectedItems();

        garments?.forEach(garment => tryOnScreenGarmentSelectionStore.select(garment as GarmentCard));
        
        outfitId && outfitStore.outfits.find(outfit => outfit.uuid === outfitId)?.setTryOnResult(undefined);

        const params: TryOnPersonNavigationParams = {
          nextScreen: nextScreen,
          nextScreenParams: nextScreenParams,
          outfitId: outfitId,
          tryOnType: tryOnType
        };

        navigation.navigate('TryOn/Person', params);
      }}>
      <HangerIcon width={20} height={20} />
      <RobotoText color="#ffffff" fontSize={16}>
        Примерить
      </RobotoText>
    </Fab>
  );
});
