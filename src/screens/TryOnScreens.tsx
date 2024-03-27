import React from "react";
import { observer } from "mobx-react-lite";
import { ButtonFooter, Footer } from "../components/Footer";
import { resultStore, tryOnScreenGarmentSelectionStore, tryOnScreenSubtypeSelectionStore, tryOnScreenTypeSelectionStore, userPhotoSelectionStore } from "../store";
import { apiEndpoint } from "../../config";
import { BaseScreen } from "./base";
import { TypeFilter } from "../components/FilterBlock";
import { GarmentList, PeopleList } from "../components/GarmentList";

export const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  const footer = true ? (
    <ButtonFooter
      onPress={() => {
        const tryOnBody = {
          clothes_id: tryOnScreenGarmentSelectionStore.selectedItem.uuid,
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
  const footer = userPhotoSelectionStore.somethingIsSelected ? (
    <ForwardFooter navigation={navigation} destination="Clothes" />
  ) : (
    <Footer navigation={navigation} />
  );

  return (
    <BaseScreen navigation={navigation} footer={footer}>
      <PeopleList />
    </BaseScreen>
  );
});
