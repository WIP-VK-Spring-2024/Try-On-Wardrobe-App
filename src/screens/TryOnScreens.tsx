import React from "react";
import { observer } from "mobx-react-lite";
import { ButtonFooter, Footer } from "../components/Footer";
import {
  resultStore,
  tryOnScreenGarmentSelectionStore,
  tryOnScreenStyleSelectionStore,
  tryOnScreenSubtypeSelectionStore,
  tryOnScreenTagsSelectionStore,
  tryOnScreenTypeSelectionStore,
  userPhotoSelectionStore,
} from '../store';

import { apiEndpoint } from "../../config";
import { BaseScreen } from "./BaseScreen";
import { TryOnResultList } from "../components/TryOnResultList";
import { TypeFilter } from "../components/FilterBlock";
import { Header, BackHeader, GarmentHeaderButtons } from "../components/Header";
import { PeopleList } from "../components/PeopleList";
import { FilterModal } from "../components/FilterModal";
import { DisableableSelectionGarmentList } from "../components/GarmentList";
import { tryOnValidationStore } from "../stores/TryOnStore"

interface TryOnRequest {
  clothes_id: string[];
  user_image_id?: string;
}

const backHeaderFontSize = 22

export const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  React.useEffect(() => {
      return () => tryOnScreenGarmentSelectionStore.clearSelectedItems();
      }, [navigation]);
  
  const header = (
    <BackHeader
      navigation={navigation}
      text="Выберите вещи"
      rightMenu={<GarmentHeaderButtons />}
      fontSize={backHeaderFontSize}
    />
  );

  const footer = tryOnScreenGarmentSelectionStore.selectedItems.length > 0 ? (
    <ButtonFooter
      onPress={() => {
        const tryOnBody: TryOnRequest = {
          clothes_id: tryOnScreenGarmentSelectionStore.selectedItems.map(item => item.uuid) as string[],
          user_image_id: userPhotoSelectionStore.selectedItem?.uuid
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
    <BaseScreen navigation={navigation} footer={footer} header={header}> 
      <TypeFilter
        typeStore={tryOnScreenTypeSelectionStore}
        subtypeStore={tryOnScreenSubtypeSelectionStore}
      />
      <DisableableSelectionGarmentList 
        store={tryOnScreenGarmentSelectionStore}
        disabledPredicate={(item) => !tryOnValidationStore.isSelectable(item.type?.name || '')}
      />
    </BaseScreen>
  );
});

export const PersonSelectionScreen = observer(
  ({ navigation }: { navigation: any }) => {
    const header = (
      <BackHeader
        navigation={navigation}
        text="Выберите фото"
        fontSize={backHeaderFontSize}
      />
    );

    return (
      <>
        <BaseScreen navigation={navigation} header={header}>
          <PeopleList navigation={navigation} />
        </BaseScreen>
        <FilterModal
          styleSelectionStore={tryOnScreenStyleSelectionStore}
          tagsSelectionStore={tryOnScreenTagsSelectionStore}
        />
      </>
    );
  },
);

export const TryOnMainScreen = observer(({navigation}: {navigation: any}) => {
  const footer = <Footer navigation={navigation} />;
  const header = <Header rightMenu={null} />;

  return (
    <>
      <BaseScreen
        navigation={navigation}
        footer={footer}
        header={header}
        screen="TryOn">
        <TryOnResultList navigation={navigation} />
      </BaseScreen>
    </>
  );
});
