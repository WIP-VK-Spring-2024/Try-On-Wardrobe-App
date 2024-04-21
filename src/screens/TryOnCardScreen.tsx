import React from "react";
import { observer } from "mobx-react-lite";
import { WINDOW_WIDTH, WINDOW_HEIGHT, BASE_COLOR } from "../consts"
import { getImageSource } from "../utils"
import ImageModal from 'react-native-image-modal';
import { TryOnResultCard } from '../stores/TryOnStore'
import { View, Image } from "@gluestack-ui/themed"
import { BaseScreen } from "./BaseScreen";
import { BackHeader } from "../components/Header";
import { UserPhoto, userPhotoStore } from "../stores/UserPhotoStore"
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { Pressable } from "react-native";
import { RobotoText } from "../components/common";

const TryOnImage = observer(({tryOnResult} : {tryOnResult: TryOnResultCard}) => {
  return (
    <ImageModal
      source={getImageSource(tryOnResult.image)}
      style={{
        width: WINDOW_WIDTH - 30,
        height: WINDOW_HEIGHT / 2,
      }}
      overlayBackgroundColor={BASE_COLOR + 'a0'}
      resizeMode="contain"
    />
  )
});

interface TryOnComponentsBlockProps {
  userPhoto: UserPhoto
  garments: GarmentCard[]
  navigation: any
}

const TryOnComponentsBlock = observer(({userPhoto, garments, navigation} : TryOnComponentsBlockProps) => {
  return (
    <View flexDirection="row">
      <View flex={1} alignItems="center" gap={5}>
        <RobotoText>Оригинал</RobotoText>
        <ImageModal
          source={getImageSource(userPhoto.image)}
          style={{
            width: (WINDOW_WIDTH - 40) / 2,
            height: WINDOW_HEIGHT / 3 - 40,
            // aspectRatio: 1
          }}
          overlayBackgroundColor={BASE_COLOR + 'a0'}
          resizeMode="contain"
        />
      </View>
      <View flex={1}>
        {garments.map(item => (
          <Pressable
            onPress={navigation.navigate('Garment', { garment: item })}>
            <Image source={getImageSource(item.image)} />
          </Pressable>
        ))}
      </View>
    </View>
  );
});

export const TryOnCardScreen = observer((props: {route: any, navigation: any}) => {
  const tryOnResult = props.route.params.tryOnResult as TryOnResultCard;
  const header = <BackHeader navigation={props.navigation} fontSize={24} text="Результат примерки" />

  return (
    <BaseScreen navigation={props.navigation} header={header} footer={null}>
      <View
        display="flex"
        flexDirection="column"
        gap={20}
        alignContent="center"
        marginLeft={20}
        marginRight={20}
        /* marginBottom={100} */>
        <TryOnImage tryOnResult={tryOnResult} />
        <TryOnComponentsBlock
          navigation={props.navigation}
          userPhoto={userPhotoStore.getPhotoByUUID(tryOnResult.user_image_id)!}
          garments={garmentStore.getGarmentsByUUID(tryOnResult.clothes_id || [])}
        />
      </View>
    </BaseScreen>
  );
});
