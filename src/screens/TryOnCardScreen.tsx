import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { WINDOW_WIDTH, WINDOW_HEIGHT, BASE_COLOR, DELETE_BTN_COLOR, ACTIVE_COLOR } from "../consts"
import { getImageSource, share } from "../utils"
import ImageModal from 'react-native-image-modal';
import { TryOnResult, tryOnStore } from '../stores/TryOnStore'
import { View, Image, Pressable } from "@gluestack-ui/themed"
import { BaseScreen } from "./BaseScreen";
import { BackHeader } from "../components/Header";
import { UserPhoto, userPhotoStore } from "../stores/UserPhotoStore"
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { DeletionModal, RobotoText } from "../components/common";
import TrashIcon from "../../assets/icons/trash.svg"
import { StackActions } from "@react-navigation/native"
import { ajax } from "../requests/common"
import { processNetworkError } from "../stores/AppState";
import ShareIcon from "../../assets/icons/share.svg"

const TryOnImage = observer(({ tryOnResult }: { tryOnResult: TryOnResult }) => {
  return (
    <View width={WINDOW_WIDTH - 30}>
      <ImageModal
        source={getImageSource(tryOnResult.image)}
        style={{
          width: WINDOW_WIDTH - 30,
          height: WINDOW_HEIGHT / 2,
        }}
        overlayBackgroundColor={BASE_COLOR + 'a0'}
        resizeMode="contain"
      />
      <Pressable position="absolute" bottom={5}>
        <ShareIcon width={25} height={25} fill={ACTIVE_COLOR} />
      </Pressable>
    </View>
  );
});

interface TryOnComponentsBlockProps {
  userPhoto: UserPhoto
  garments: GarmentCard[]
  navigation: any
}

const TryOnComponentsBlock = observer(({userPhoto, garments, navigation} : TryOnComponentsBlockProps) => {
  return (
      <View alignItems="center" gap={10}>
        <RobotoText>Примеренные вещи</RobotoText>
        <View gap={10} flexDirection="row">
          {garments.map((item, i) => (
            <Pressable
              padding={10}
              borderRadius={15}
              backgroundColor="#ffffff"
              key={i}
              onPress={()=>navigation.navigate('Garment', { garment: item })}>
              <Image h={WINDOW_HEIGHT/4} w={WINDOW_WIDTH/3} resizeMode="contain" source={getImageSource(item.image)} alt="garment"/>
            </Pressable>
          ))}
        </View>
      </View>
  );
});

export const TryOnCardScreen = observer((props: {route: any, navigation: any}) => {
  const [deletionModalShown, setDeletionModalShown] = useState(false);

  const tryOnResult = props.route.params.tryOnResult as TryOnResult;

  const deleteBtn = (
    <Pressable
      onPress={() => {
        setDeletionModalShown(true);
      }}>
      <TrashIcon width={25} height={25} fill={DELETE_BTN_COLOR} />
    </Pressable>
  );

  const header = (
    <BackHeader
      navigation={props.navigation}
      fontSize={24}
      text="Результат примерки"
      rightMenu={deleteBtn}
    />
  );

  const deleteTryOnResult = (uuid: string) => ajax.apiDelete(`/try-on/${uuid}`, {credentials: true})
          .then(_ => {
            tryOnStore.removeResult(uuid);
            props.navigation.dispatch(StackActions.pop(1));
          })
          .catch(err => processNetworkError(err));

  return (
    <BaseScreen navigation={props.navigation} header={header} footer={null}>
      <View
        display="flex"
        flexDirection="column"
        gap={20}
        alignItems="center"
        marginLeft={20}
        marginRight={20}
        >
        <TryOnImage tryOnResult={tryOnResult} />
        <TryOnComponentsBlock
          navigation={props.navigation}
          userPhoto={userPhotoStore.getPhotoByUUID(tryOnResult.user_image_id)!}
          garments={garmentStore.getGarmentsByUUID(tryOnResult.clothes_id || [])}
        />
      </View>
      <DeletionModal
        onAccept={deleteTryOnResult}
        text="Удалить результат примерки?"
        isOpen={deletionModalShown}
        deleteUUID={tryOnResult.uuid}
        hide={() => {
          setDeletionModalShown(false);
        }}
      />
    </BaseScreen>
  );
});
