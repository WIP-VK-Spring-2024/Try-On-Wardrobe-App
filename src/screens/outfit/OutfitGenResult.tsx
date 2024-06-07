import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { BaseScreen } from "../BaseScreen";
import { Canvas, CanvasProps, Image, Rect, Skia, SkiaDomView, SkImage, useCanvasRef } from "@shopify/react-native-skia";
import { garmentStore } from "../../stores/GarmentStore";
import { ImageType } from "../../models";
import { getImageSource } from "../../utils";
import { View } from "@gluestack-ui/themed";
import { ACTIVE_COLOR, FOOTER_HEIGHT, HEADER_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../consts";
import { BackHeader } from "../../components/Header";

import { Pressable } from "@gluestack-ui/themed";

import RNFS from 'react-native-fs';
import { Outfit, OutfitItem, OutfitItemRect, outfitStore } from "../../stores/OutfitStore";
import { uploadOutfit } from "../../requests/outfit";
import { StyleProp, ViewStyle } from "react-native";
import { outfitGenUUIDStore } from "../../stores/OutfitGenStores";

import FilledHeartIcon from '../../../assets/icons/heart-filled.svg';
import HeartIcon from '../../../assets/icons/heart.svg';
import { profileStore } from "../../stores/ProfileStore";
import { ajax } from "../../requests/common";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const MARGIN = 10;
const GAP = 10;

interface OutfitGenItemProps {
  x: number
  y: number
  width: number
  height: number
  image?: ImageType
}

const OutfitGenItem = observer((props: OutfitGenItemProps) => {
  const [skImage, setImage] = useState<SkImage | null>(null);
  
  useEffect(() => {
    if (props.image === undefined) {
      return;
    }

    Skia.Data.fromURI(getImageSource(props.image).uri)
      .then(data => {
        setImage(Skia.Image.MakeImageFromEncoded(data))
      })
      .catch(err => console.error(err))
  }, [props.image])

  return (
    skImage === null
    ? <Rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
    : <Image
      image={skImage}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
    />
  )
})

interface OutfitGenCardProps {
  navigation: any
  garmentUUIDS: string[]
}

interface OutfitGenCardCanvasProps {
  canvasRef: React.RefObject<SkiaDomView>
  items: OutfitItem[]
  style: StyleProp<ViewStyle>
}

const OutfitGenCardCanvas = observer((props: OutfitGenCardCanvasProps) => {
  const garments = props.items.map(item => item.garment);

  return (
    <Canvas
      style={props.style}
      ref={props.canvasRef}
    >
      {
        garments.map((garment, i) => {
          const rect = props.items[i].rect;
          return <OutfitGenItem
            key={i}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            image={garment?.image}
          />
        })
      }
    </Canvas>
  )
})

const OutfitGenCard = observer((props: OutfitGenCardProps) => {
  const garments = props.garmentUUIDS.map(uuid => garmentStore.garments.find(g => g.uuid === uuid));

  const width = WINDOW_WIDTH / 2 - MARGIN - GAP / 2;
  const height = WINDOW_HEIGHT / 2 - MARGIN - GAP / 2 - 80;

  const cnt = props.garmentUUIDS.length;

  const itemHeight = height / cnt - 20;
  const itemWidth = itemHeight;

  const items = props.garmentUUIDS.map((uuid, i) => {
    const rect =  new OutfitItemRect({
      x: (width - itemWidth) / 2,
      y: (i * (itemHeight + 10)) + 10,
      width: itemWidth,
      height: itemHeight,
      zIndex: i
    });

    return new OutfitItem({
      garmentUUID: uuid,
      rect: rect,
    });
  })

  const [uuid, setUUID] = useState<string | undefined>(undefined);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const canvasRef = useCanvasRef();

  const onSave = () => {
    setIsSelected(true);

    const outfit = new Outfit({
      privacy: profileStore.currentUser?.privacy || 'private',
      items: items
    });

    return canvasRef.current?.makeImageSnapshotAsync()
      .then(image => {
        const bytes = image.encodeToBase64();

        const fileName = `${Date.now()}.png`
        const path = RNFS.DocumentDirectoryPath + `/images/outfits/${fileName}`;

        RNFS.writeFile(path, bytes, 'base64');

        outfit.setImage({
          type: 'local',
          uri: path
        });

        return uploadOutfit(outfit)
          .then(() => {
            setUUID(outfit.uuid);
            outfitStore.addOutfit(outfit);
            return outfit;
          })
          .catch(reason => {
            setIsSelected(false);
            console.error(reason);
            return false;
          })

      })
      .catch(reason => {
        console.error(reason)
        return false;
      })
  }

  return (
    <Pressable
      onPress={() => {
        const outfit = outfitStore.outfits.find(o => o.uuid === uuid);

        if (outfit === undefined && isSelected === false) {
          onSave()?.then((res) => {
            if (res) {
              props.navigation.navigate('Outfit', {outfit: res})
            }
          })
        } else {
          props.navigation.navigate('Outfit', {outfit: outfit})
        }
      }}
    >
      <OutfitGenCardCanvas
        style={{
          width: width,
          height: height,
          backgroundColor: '#ffffff'
        }}
        canvasRef={canvasRef}
        items={items}
      />
      <Pressable
        position='absolute'
        top={10}
        right={10}

        onPress={() => {
          if (isSelected) {
            setIsSelected(false);
            ajax
              .apiDelete(`/outfits/${uuid}`, { credentials: true })
              .then(_ => uuid && outfitStore.removeOutfit(uuid))
              .catch(_ => setIsSelected(true));
          } else {
            onSave();
          }
        }}
      >
        {
          isSelected
          ? <FilledHeartIcon width={40} height={40} fill={ACTIVE_COLOR}/>
          : <HeartIcon width={40} height={40} fill={ACTIVE_COLOR}/>
        }
      </Pressable>
    </Pressable>
  )
})

interface OutfitGenResultScreenProps {
  navigation: any
}

export const OutfitGenResultScreen = observer((props: OutfitGenResultScreenProps) => {
  useEffect(() => {
    return () => outfitGenUUIDStore.setOutfits([]);
  }, []);
  
  const outfits = outfitGenUUIDStore.outfits;
  // const outfits = outfitStore.outfits
  //   .slice(0, 4)
  //   .map(outfit => outfit.items.map(item => item.garmentUUID));

  return (
    <BaseScreen
      navigation={props.navigation}
      header={
        <BackHeader navigation={props.navigation} text="Образы"/>
      }
    >
      <View
        flexDirection="row"
        flexWrap="wrap"
        gap={GAP}
        margin={10}
      >
        {
          outfits.length !== 0 ?
            outfits.map((outfit, i) => {
              return (
                <OutfitGenCard
                  navigation={props.navigation}
                  key={i}
                  garmentUUIDS={outfits[i]}
                />
              )
            })
            :
            <View
              w="100%"
              h={WINDOW_HEIGHT - FOOTER_HEIGHT - HEADER_HEIGHT}
              justifyContent="center"
              alignItems="center"
            >
              <LoadingSpinner />
            </View>
        }
      </View>
    </BaseScreen>
  )
});
