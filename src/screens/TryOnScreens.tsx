import React from "react";
import { observer } from "mobx-react-lite";
import { ButtonFooter, Footer } from "../components/Footer";
import { resultStore, tryOnScreenGarmentSelectionStore, tryOnScreenStyleSelectionStore, tryOnScreenSubtypeSelectionStore, tryOnScreenTagsSelectionStore, tryOnScreenTypeSelectionStore, userPhotoSelectionStore } from "../store";
import { apiEndpoint } from "../../config";
import { BaseScreen } from "./base";
import { TryOnResultList } from "../components/TryOnResultList";
import { TypeFilter } from "../components/FilterBlock";
import { GarmentList } from "../components/GarmentList";
import { PeopleList } from "../components/PeopleList";
import { FilterModal } from "../components/FilterModal";

interface TryOnRequest {
  clothes_id: string[];
  user_image_id: string;
}

export const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  React.useEffect(() => {
      return () => tryOnScreenGarmentSelectionStore.clearSelectedItems();
      }, [navigation]);

  const footer = tryOnScreenGarmentSelectionStore.selectedItems.length > 0 ? (
    <ButtonFooter
      onPress={() => {
        const tryOnBody: TryOnRequest = {
          clothes_id: tryOnScreenGarmentSelectionStore.selectedItems.map(item => item.uuid),
          user_image_id: userPhotoSelectionStore.selectedItem.uuid
        }

        fetch(
          apiEndpoint + '/try-on',
          {
            method: 'POST',
            body: JSON.stringify(tryOnBody),
            headers: {
              'Content-Type': 'application/json'
            }
          },
        ).then(() => {
          navigation.navigate('Result');
          resultStore.clearResult();
        }).catch(err => console.error(err))
      }}
    />
  ) : (
    <Footer navigation={navigation} />
  );
  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <TypeFilter
        typeStore={tryOnScreenTypeSelectionStore}
        subtypeStore={tryOnScreenSubtypeSelectionStore}
      />
      <GarmentList navigation={navigation}/>
    </BaseScreen>
  );
});

const ForwardFooter = observer(
  ({navigation, destination}: {navigation: any; destination: string}) => {
    return <ButtonFooter text="Выбрать" onPress={() => navigation.navigate(destination)} />;
  },
);

export const PersonSelectionScreen = observer(({navigation}: {navigation: any}) => {
  return (
    <>
      <BaseScreen navigation={navigation}>
        <PeopleList navigation={navigation} />
      </BaseScreen>
      <FilterModal
        styleSelectionStore={tryOnScreenStyleSelectionStore}
        tagsSelectionStore={tryOnScreenTagsSelectionStore}
      />
    </>
  );
});

export const TryOnMainScreen = observer(({navigation}: {navigation: any}) => {
  const footer = <Footer navigation={navigation} />;

  return (
    <>
      <BaseScreen navigation={navigation} footer={footer}>
        <TryOnResultList navigation={navigation} />
      </BaseScreen>
    </>
  );
});
