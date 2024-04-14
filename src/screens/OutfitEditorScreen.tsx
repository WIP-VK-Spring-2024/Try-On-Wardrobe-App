import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { OutfitEditor } from "../components/editor/Editor";
import { BackHeader } from "../components/Header";
import { Pressable, View } from "@gluestack-ui/themed";

import SaveIcon from '../../assets/icons/save.svg';
import { ACTIVE_COLOR } from "../consts";
import { useSharedValue } from "react-native-reanimated";
import { RectangleWithPayload } from "../components/editor/models";
import { autorun } from "mobx";
import { itemFromRect, loadSkImage, rectFromItem } from "../components/editor/utils";
import { useCanvasRef } from "@shopify/react-native-skia";

import RNFS from 'react-native-fs';
import { Outfit } from "../stores/OutfitStore";
import { StackActions } from "@react-navigation/native";
import { updateOutfit, uploadOutfit } from "../requests/outfit";
import { appState } from "../stores/AppState";
import { ConnectionErrorAlert, SuccessAlert } from "../components/MessageAlert";


interface OutfitEditorHeaderProps {
  navigation: any
  onSave?: ()=>void
}

export const OutfitEditorHeader = (props: OutfitEditorHeaderProps) => {
  return (
    <BackHeader
      navigation={props.navigation}
      text="Комплект"
      rightMenu={
      <Pressable
        onPress={props.onSave}
      >
        <SaveIcon
          width={30}
          height={30}

          fill={ACTIVE_COLOR}
        />
      </Pressable>}
    />
  )
}

export type GarmentRect = RectangleWithPayload<string>;

interface OutfitEditorScreenProps {
  navigation: any
  route: any
}

export const OutfitEditorScreen = observer((props: OutfitEditorScreenProps) => {
  const { outfit }: {outfit: Outfit} = props.route.params;

  const positions = useSharedValue<GarmentRect[]>(outfit.items.map(rectFromItem));

  const canvasRef = useCanvasRef();

  useEffect(() => {
    autorun(() => {
      positions.value = outfit.items.map(rectFromItem);
    })
  }, [])

  // useEffect(() => {
  //   autorun(async () => {
  //     const rects = outfit.items.map(rectFromItem).map(async rect => {
  //       if (rect.image !== undefined) {
  //         const img = await loadSkImage(rect.image);
  //         return {...rect, skImage: img || undefined};
  //       }
  //       return rect;
  //     })

  //     Promise.all(rects).then((rects => {
  //       positions.value = rects;
  //     }))

  //     // positions.value = outfit.items.map(rectFromItem);
  //   })
  // }, [])

  const onSave = () => {
    outfit.setItems(positions.value.map(itemFromRect));

    canvasRef.current?.makeImageSnapshotAsync()
      .then(image => {
        const bytes = image.encodeToBase64();
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/outfit');

        const fileName = `${Date.now()}.png`

        RNFS.writeFile(RNFS.DocumentDirectoryPath + `/outfit/${fileName}`, bytes, 'base64');

        outfit.setImage({
          type: 'local',
          uri: `/outfit/${fileName}`
        });

        const processSave = (status: boolean) => {
          if (status) {
            appState.setSuccessMessage('Изменения успешно сохранены');
            setTimeout(()=>appState.closeSuccessMessage(), 2000);
          } else {
            appState.setError('network');
          }
        }

        if (outfit.uuid === undefined) {
          uploadOutfit(outfit).then(processSave);
        } else {
          updateOutfit(outfit).then(processSave);
        }

      })
      .catch(reason => console.error(reason))
  }

  return (
    <View
      height="100%"
    >
      <OutfitEditorHeader navigation={props.navigation} onSave={onSave}/>
      { appState.error==='network' && <ConnectionErrorAlert/> }
      { appState.successMessage!==undefined && <SuccessAlert msg={appState.successMessage}/> }
      <OutfitEditor positions={positions} outfit={outfit} canvasRef={canvasRef}/>
    </View>
  )
});
