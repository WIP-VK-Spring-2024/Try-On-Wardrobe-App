import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { BaseScreen } from "./BaseScreen";
import { Canvas, CanvasProps, Image, Rect, Skia, SkImage } from "@shopify/react-native-skia";
import { garmentStore } from "../stores/GarmentStore";
import { ImageType } from "../models";
import { getImageSource } from "../utils";
import { View } from "@gluestack-ui/themed";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../consts";
import { BackHeader } from "../components/Header";

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
    console.log('fetch', props.image)
    if (props.image === undefined) {
      return;
    }

    Skia.Data.fromURI(getImageSource(props.image).uri)
      .then(data => {
        console.log('fetched data', props.image!.uri)
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
  garmentUUIDS: string[]
}

const OutfitGenCard = observer((props: OutfitGenCardProps) => {
  const garments = props.garmentUUIDS.map(uuid => garmentStore.garments.find(g => g.uuid === uuid));

  const width = WINDOW_WIDTH / 2 - MARGIN - GAP / 2;
  const height = WINDOW_HEIGHT / 2 - MARGIN - GAP / 2 - 80;

  const cnt = props.garmentUUIDS.length;

  const itemHeight = height / cnt - 20;
  const itemWidth = itemHeight;

  return (
    <Canvas
      style={{
        width: width,
        height: height,
        backgroundColor: '#ffffff'
      }}
    >
      {
        garments.map((garment, i) => {
          return <OutfitGenItem
            key={i}
            x={(width - itemWidth) / 2}
            y={(i * (itemHeight + 10)) + 10}
            width={itemWidth}
            height={itemHeight}
            image={garment?.image}
          />
        })
      }
    </Canvas>
  )
})

interface OutfitGenResultScreenProps {
  navigation: any
}

export const OutfitGenResultScreen = observer((props: OutfitGenResultScreenProps) => {
  const uuids = garmentStore.garments.slice(0, 3).map(g => g.uuid) as string[];
  return (
      <BaseScreen
        navigation={props.navigation}
        header={
          <BackHeader navigation={props.navigation} text="Комплекты"/>
        }
      >
        <View
          flexDirection="row"
          flexWrap="wrap"
          gap={GAP}
          margin={10}
        >
          {
            [...Array(4).keys()].map(i => {
              return (
                <OutfitGenCard
                  garmentUUIDS={uuids}
                />
              )
            })
          }
        </View>
      </BaseScreen>
  )
});
