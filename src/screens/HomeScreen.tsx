import React from "react";

import { useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { appState } from "../stores/AppState";
import { BackHandler } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { TypeFilter } from "../components/FilterBlock";
import { garmentScreenGarmentSelectionStore, garmentScreenStyleSelectionStore, garmentScreenSubtypeSelectionStore, garmentScreenTagsSelectionStore, garmentScreenTypeSelectionStore } from "../store";
import { StaticGarmentList } from "../components/GarmentList";
import { FilterModal } from "../components/FilterModal";
import { NoClothesMessage } from "../components/NoClothesMessage"

export const HomeScreen = observer(({navigation}: {navigation: any}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (appState.createMenuVisible) {
          appState.setCreateMenuVisible(false);
          return true;
        }

        return false;
      }

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [appState.createMenuVisible])
  )
  
  
  return (
    <>
      <BaseScreen navigation={navigation} screen="Home">
        <TypeFilter
          typeStore={garmentScreenTypeSelectionStore}
          subtypeStore={garmentScreenSubtypeSelectionStore}
        />
        {garmentScreenGarmentSelectionStore.items.length > 0 ? (
            <StaticGarmentList navigation={navigation} />
        ) : (
          <NoClothesMessage category={garmentScreenTypeSelectionStore.selectedItem?.name || ''}/>
        )}
      </BaseScreen>
      <FilterModal
        styleSelectionStore={garmentScreenStyleSelectionStore}
        tagsSelectionStore={garmentScreenTagsSelectionStore}
      />
    </>
  );
});
