import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { OutfitEditor } from "../../components/editor/Editor";
import { BackHeader } from "../../components/Header";
import { Pressable, View } from "@gluestack-ui/themed";

import { ACTIVE_COLOR } from "../../consts";
import { useSharedValue } from "react-native-reanimated";
import { RectangleWithPayload } from "../../components/editor/models";
import { autorun } from "mobx";
import { itemFromRect, loadSkImage, rectFromItem } from "../../components/editor/utils";
import { SkImage, useCanvasRef } from "@shopify/react-native-skia";

import { Outfit, outfitStore } from "../../stores/OutfitStore";
import { updateOutfit, uploadOutfit } from "../../requests/outfit";
import { appState } from "../../stores/AppState";
import { ConnectionErrorAlert, SuccessAlert } from "../../components/MessageAlert";

import RNFS from 'react-native-fs';
import SaveIcon from '../../../assets/icons/save.svg';

interface OutfitEditorHeaderProps {
  navigation: any
  onSave?: ()=>void
  outfit: Outfit
}

export const OutfitEditorHeader = (props: OutfitEditorHeaderProps) => {
  return (
    <BackHeader
      navigation={props.navigation}
      onBackPress={() => {
        props.navigation.reset({
          index: 1,
          routes: [
            { name: "OutfitSelection" },
            { 
              name: "Outfit",
              params: {
                outfit: props.outfit
              }
            }
          ]
        })
      }}
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
  const { outfit, oldItems }: {outfit: Outfit, oldItems: string[]} = props.route.params;

  const positions = useSharedValue<GarmentRect[]>(outfit.items.map(rectFromItem));

  const images = useSharedValue<(SkImage | undefined)[]>([]);
  // const [images, setImages] = useState<(SkImage | undefined)[]>([]);

  useEffect(() => {
    const imagePromises = outfit.items
      .map((item, i) => {
        if (item.image === undefined) {
          return undefined;
        }

        return loadSkImage(item.image)
          .then(img => {
            if (img === null) {
              return undefined;
            }

            return img;
          })
          .catch(reason => {
            console.error(reason);
            return undefined;
          })
      })

    Promise.all(imagePromises).then(skImages => {
      // setImages(skImages);
      images.value = skImages;
    })
  }, [])

  const canvasRef = useCanvasRef();

  useEffect(() => {
    autorun(() => {
      positions.value = outfit.items.map(rectFromItem);
    })
  }, [])

  const onSave = () => {
    outfit.setItems(positions.value.map(itemFromRect));

    canvasRef.current?.makeImageSnapshotAsync()
      .then(image => {
        const makeName = () => {
          // if (outfit.uuid  === undefined) {
            return`${Date.now()}.png`;
          // }
          
          // return getOutfitImageName(outfit);
        }
        
        const fileName = makeName();
        
        const path = RNFS.DocumentDirectoryPath + `/images/outfits/${fileName}`;
        
        const bytes = image.encodeToBase64();
        RNFS.writeFile(path, bytes, 'base64');

        outfit.setImage({
          type: 'local',
          uri: path
        });

        const processSave = (status: boolean) => {
          console.log('processSave');
          if (status) {
            appState.setSuccessMessage('Изменения успешно сохранены');
            setTimeout(()=>appState.closeSuccessMessage(), 2000);
          } else {
            appState.setError('network');
          }
        }

        if (outfit.uuid === undefined) {
          uploadOutfit(outfit)
            .then((status) => {
              outfitStore.addOutfit(outfit);
              processSave(status);
            })
            .catch(reason => console.error(reason))
        } else {
          updateOutfit(outfit, oldItems)
            .then(processSave)
            .catch(reason => console.error(reason))
        }

      })
      .catch(reason => console.error(reason))
  }

  return (
    <View
      height="100%"
    >
      <OutfitEditorHeader 
        navigation={props.navigation}
        outfit={outfit}
        onSave={onSave}
      />
      { appState.error==='network' && <ConnectionErrorAlert/> }
      { appState.successMessage!==undefined && <SuccessAlert msg={appState.successMessage}/> }
      <OutfitEditor 
        positions={positions}
        images={images}
        outfit={outfit} 
        canvasRef={canvasRef}
      />
    </View>
  )
});
