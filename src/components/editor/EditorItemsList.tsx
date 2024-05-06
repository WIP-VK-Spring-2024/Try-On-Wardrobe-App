import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { RectangleWithIndex } from "./models";
import { observer } from "mobx-react-lite";
import { EditorItem } from "./EditorItem";
import { SkImage } from "@shopify/react-native-skia";

interface EditorItemListProps {
  positions: SharedValue<RectangleWithIndex[]>
  images: SharedValue<(SkImage | undefined)[]>
}

export const EditorItemList = observer((props: EditorItemListProps) => {
  const skImages = useDerivedValue(() => {
    return props.positions.value.map(item => props.images.value[item.index]);
  })

  const indexedPositions = useDerivedValue(() => {
    return props.positions.value.map((item, i) => ({...item, i}))
  })

  return (
    <>
      {
        indexedPositions.value.map((item) => {
          if (props.positions.value[item.i] === undefined) {
            return undefined;
          }

          const skImage = useDerivedValue(() => {
            return skImages.value[item.i] || null;
          })

          return <EditorItem
            key={item.index}
            id={item.i}
            positions={props.positions}
            skImage={skImage}
          />
        })
      }
    </>
  )
})
