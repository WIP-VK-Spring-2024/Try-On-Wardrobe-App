import React, { useEffect } from "react";
import {PermissionsAndroid } from 'react-native';
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
import RNFS from 'react-native-fs';

const pictures_path = RNFS.DocumentDirectoryPath + '/images/clothes';

RNFS.mkdir(pictures_path);

const requestPermission = async () => {
  try {
    console.log('asking for permission')
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      ]
    )
    if (granted['android.permission.CAMERA'] && granted['android.permission.WRITE_EXTERNAL_STORAGE'] && granted['android.permission.READ_MEDIA_IMAGES']) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (error) {
    console.log('permission error', error)
  }
}
export const HomeScreen = observer(({navigation}: {navigation: any}) => {
  useEffect(() => {
    requestPermission();
  }, [])

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
