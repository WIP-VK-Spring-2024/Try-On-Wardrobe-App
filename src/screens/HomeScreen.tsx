import React from "react";

import { useFocusEffect } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { appState } from "../stores/AppState";
import { BackHandler } from "react-native";
import { BaseScreen } from "./base";
import { TypeFilter } from "../components/FilterBlock";
import { garmentScreenSubtypeSelectionStore, garmentScreenTypeSelectionStore } from "../store";
import { StaticGarmentList } from "../components/GarmentList";
import { FilterModal } from "../components/FilterModal";

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
      <BaseScreen navigation={navigation}>
        <TypeFilter
          typeStore={garmentScreenTypeSelectionStore}
          subtypeStore={garmentScreenSubtypeSelectionStore}
        />
        <StaticGarmentList navigation={navigation}/>
      </BaseScreen>
      <FilterModal/>
    </>
  );
});
