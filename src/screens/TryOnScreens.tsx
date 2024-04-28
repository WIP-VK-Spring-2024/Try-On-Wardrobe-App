import React, { useEffect, useState } from "react";
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

import { View } from "@gluestack-ui/themed";

import { apiEndpoint } from "../../config";
import { BaseScreen } from "./BaseScreen";
import { TryOnResultList } from "../components/TryOnResultList";
import { TypeFilter } from "../components/FilterBlock";
import { Header, BackHeader, GarmentHeaderButtons } from "../components/Header";
import { PeopleList } from "../components/PeopleList";
import { FilterModal } from "../components/FilterModal";
import { DisableableSelectionGarmentList } from "../components/GarmentList";
import { ajax } from "../requests/common";
import { tryOnValidationStore } from "../stores/TryOnStore"
import { InfoButton, Tooltip } from "../components/InfoButton";
import { DeletionModal, RobotoText, UnorderedList } from "../components/common"
import { PRIMARY_COLOR } from "../consts";
import { appState } from "../stores/AppState";
import { deleteUserPhoto } from "../requests/user_photo"
import { useFocusEffect } from "@react-navigation/native";
import { NoClothesMessage } from "../components/NoClothesMessage";

interface TryOnRequest {
  clothes_id: string[];
  user_image_id?: string;
}

const backHeaderFontSize = 22

const tooltipFontSize = 15

const tryOnStepFontSize = 12
const tryOnHeaderFontSize = 15

export const GarmentSelectionScreen = observer(({navigation}: {navigation: any}) => {
  useEffect(() => {
      return () => tryOnScreenGarmentSelectionStore.clearSelectedItems();
      }, [navigation]);
  
  const [infoShown, setInfoShown] = useState(false);

  const tooltip = (
    <Tooltip
      isOpen={infoShown}
      hide={() => setInfoShown(false)}
      top={-170}
      margin={20}
      >
      <RobotoText fontSize={tooltipFontSize}>
        Примерять можно вещи категорий "Верх", "Низ" и "Платья".
      </RobotoText>
      <RobotoText fontSize={tooltipFontSize}>
        При примерке нескольких вещей вы можете выбрать только одну вещь каждой
        категории.
      </RobotoText>
      <RobotoText fontSize={tooltipFontSize}>
        Платья можно примерять только без других вещей.
      </RobotoText>
    </Tooltip>
  );

  const rightMenu = (
    <View flexDirection="row" gap={10} justifyContent="space-between" alignItems="center">
      <InfoButton size={28} fill={infoShown ? PRIMARY_COLOR : "#000000"} onPress={() => setInfoShown(!infoShown)}/>
      <GarmentHeaderButtons />
    </View>
  );

  const header = (
    <BackHeader
      navigation={navigation}
      text="Выберите вещи"
      rightMenu={rightMenu}
      fontSize={backHeaderFontSize}>
      <RobotoText fontSize={tryOnStepFontSize}>Шаг 2 из 2</RobotoText>
      <RobotoText fontSize={tryOnHeaderFontSize}>Выберите одежду для примерки</RobotoText>
    </BackHeader>
  );

  const footer =
    tryOnScreenGarmentSelectionStore.selectedItems.length > 0 ? (
      <ButtonFooter
        onPress={() => {
          const tryOnBody: TryOnRequest = {
            clothes_id: tryOnScreenGarmentSelectionStore.selectedItems.map(
              item => item.uuid,
            ) as string[],
            user_image_id: userPhotoSelectionStore.selectedItem?.uuid,
          };

          console.log(tryOnBody);

          ajax.apiPost('/try-on', {
            credentials: true,
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
    >
    {tooltip}
  </ButtonFooter>
) : (
  <View w="100%" justifyContent="center">{tooltip}</View>
);

  return (
    <BaseScreen navigation={navigation} footer={footer} header={header}>
      {tryOnScreenGarmentSelectionStore.items.length > 0 ? (
        <>
          <TypeFilter
            typeStore={tryOnScreenTypeSelectionStore}
            subtypeStore={tryOnScreenSubtypeSelectionStore}
          />
          <DisableableSelectionGarmentList
            store={tryOnScreenGarmentSelectionStore}
            typeStore={tryOnScreenTypeSelectionStore}
            disabledPredicate={item =>
              !tryOnValidationStore.isSelectable(item.type?.name || '')
            }
          />
        </>
      ) : (
        <NoClothesMessage afterIconText="в главном меню!" />
      )}
    </BaseScreen>
  );
});

export const PersonSelectionScreen = observer(
  ({ navigation }: { navigation: any }) => {
    const [infoShown, setInfoShown] = useState(false);
    useFocusEffect(React.useCallback(() => {
      userPhotoSelectionStore.unselect();
    }, []))

    const [deletionModalShown, setDeletionModalShown] = useState(false);
    const [deleteUUID, setDeleteUUID] = useState<string | undefined>(undefined);

    const tooltip = (
      <View w="100%" justifyContent="center">
        <Tooltip
          isOpen={infoShown}
          hide={() => setInfoShown(false)}
          top={-210}
          margin={20}>
          <RobotoText fontSize={tooltipFontSize}>
            Для того, чтобы примерить одежду, сначала нужно загрузить своё фото.
          </RobotoText>
          <RobotoText fontSize={tooltipFontSize}>
            Для достижения лучших результатов примерки, ваши фото должны быть:
          </RobotoText>
          <UnorderedList fontSize={tooltipFontSize} items={['В полный рост', 'Вертикальной ориентации', 'С маленькими отступами по краям']} margin={10}/>
          <RobotoText fontSize={tooltipFontSize}>
            Для проверки функции примерки вам предоставлено тестовое фото.
          </RobotoText>
        </Tooltip>
      </View>
    );

    const rightMenu = (
      <InfoButton
        size={28}
        fill={infoShown ? PRIMARY_COLOR : '#000000'}
        onPress={() => setInfoShown(!infoShown)}
      />
    );

    const header = (
      <BackHeader
        navigation={navigation}
        rightMenu={rightMenu}
      >
        <RobotoText fontSize={tryOnStepFontSize}>Шаг 1 из 2</RobotoText>
        <RobotoText fontSize={tryOnHeaderFontSize}>Выберите своё фото</RobotoText>
      </BackHeader>
    );

    return (
      <>
        <BaseScreen navigation={navigation} header={header} footer={tooltip}>
          <PeopleList navigation={navigation} onItemDelete={(item) => {
            setDeleteUUID(item.uuid);
            setDeletionModalShown(true);
          }} />
        </BaseScreen>
        <FilterModal
          styleSelectionStore={tryOnScreenStyleSelectionStore}
          tagsSelectionStore={tryOnScreenTagsSelectionStore}
        />
        <DeletionModal
          onAccept={deleteUserPhoto}
          text="Удалить ваше фото?"
          isOpen={deletionModalShown}
          deleteUUID={deleteUUID}
          hide={() => {
            setDeleteUUID(undefined);
            setDeletionModalShown(false);
          }}
        />
      </>
    );
  },
);

export const TryOnMainScreen = observer(({navigation}: {navigation: any}) => {
  const footer = <Footer navigation={navigation} />;
  const header = <Header navigation={navigation} rightMenu={null} />;

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
