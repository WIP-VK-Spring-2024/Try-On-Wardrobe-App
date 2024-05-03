import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Rectangle, RectangleWithIndex } from "./models";
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

  return (
    <>
      {
        props.positions.value.map((item, i) => {
          const skImage = useDerivedValue(() => {
            return skImages.value[i] || null;
          })

          return <EditorItem
            key={item.index}
            id={i}
            positions={props.positions}
            skImage={skImage}
          />
        })
      }
    </>
  )
})
