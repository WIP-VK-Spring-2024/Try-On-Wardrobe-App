import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { Rectangle, RectangleWithIndex } from "./models";
import { GestureDetectorView } from "./GestureDetectorView";
import { NativeGesture } from "react-native-gesture-handler";


type idSharedValue = SharedValue<number | undefined>;

interface GestureDetectorViewListProps {
  positions: SharedValue<Rectangle[]>
  sortedPositions: SharedValue<RectangleWithIndex[]>
  movingId: idSharedValue
  activeId: idSharedValue
  cursorPosition: SharedValue<{x: number, y: number}>
  basePosition: {x: number, y: number, w: number, h: number}
}

export const GestureDetectorViewList = observer((props: GestureDetectorViewListProps) => {
  const indexedPositions = useDerivedValue(() => {
    return props.sortedPositions.value.map((item, i) => ({...item, i}))
  })

  return (
    <>
      {
        indexedPositions.value.map(item => {
          return (
            <GestureDetectorView 
              key={item.i} 
              positions={props.positions}
              sortedPositions={props.sortedPositions}
              movingId={props.movingId}
              activeId={props.activeId}
              cursorPosition={props.cursorPosition}
              basePosition={props.basePosition}
              id={item.i}
            />
          )
        })
      }
    </>
  )
})
