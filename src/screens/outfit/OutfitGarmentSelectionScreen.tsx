import React from "react";
import { observer } from "mobx-react-lite";
import { BackHeader, GarmentHeaderButtons } from "../../components/Header";
import { outfitScreenGarmentSelectionStore, outfitScreenSubtypeSelectionStore, outfitScreenTypeSelectionStore } from "../../store";
import { ButtonFooter } from "../../components/Footer";
import { StackActions } from "@react-navigation/native";
import { BaseScreen } from "../BaseScreen";
import { TypeFilter } from "../../components/FilterBlock";
import { MultipleSelectionGarmentList } from "../../components/GarmentList";
import { Image } from "react-native";
import { getImageSource } from "../../utils";


interface OutfitGarmentSelectionScreenProps {
  navigation: any
  route: any
}

export const OutfitGarmentSelectionScreen = observer(
  (props: OutfitGarmentSelectionScreenProps) => {

    const outfit = props.route.params.outfit;

    const header = (
      <BackHeader
        rightMenu={<GarmentHeaderButtons />}
        navigation={props.navigation}
        text="Одежда"
      />
    )

    const footer = outfitScreenGarmentSelectionStore.somethingIsSelected
      ? <ButtonFooter
        onPress={async ()=>{
          await outfit.addGarments(outfitScreenGarmentSelectionStore.selectedItems);
          outfitScreenGarmentSelectionStore.clearSelectedItems();
          props.navigation.dispatch(StackActions.pop(1));
          props.navigation.navigate("Editor", {outfit: outfit});
        }}
      />
      : undefined

    return (
      <BaseScreen 
        navigation={props.navigation}
        header={header}
        footer={footer}
      >
        <TypeFilter
            typeStore={outfitScreenTypeSelectionStore}
            subtypeStore={outfitScreenSubtypeSelectionStore}
        />

        <MultipleSelectionGarmentList
          store={outfitScreenGarmentSelectionStore}
        />
      </BaseScreen>
    )
});