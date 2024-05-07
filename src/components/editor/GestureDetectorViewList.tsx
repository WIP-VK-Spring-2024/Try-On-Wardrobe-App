import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { RectangleWithIndex } from "./models";
import { GestureDetectorView } from "./GestureDetectorView";
import { NativeGesture } from "react-native-gesture-handler";


interface GestureDetectorViewListProps {
  positions: SharedValue<RectangleWithIndex[]>
  getPanGesture: (id: number)=>NativeGesture
}

export const GestureDetectorViewList = observer((props: GestureDetectorViewListProps) => {
  const indexedPositions = useDerivedValue(() => {
    console.log('update', props.positions.value.map(item => [item.index, item.zIndex]))
    return props.positions.value.map((item, i) => ({...item, i}))
  })

  return (
    <>
      {
        indexedPositions.value.map(item => {
          return (
            <GestureDetectorView 
              key={item.i} 
              gesture={props.getPanGesture(item.index)}
              positions={props.positions} 
              id={item.index}
            />
          )
        })
      }
    </>
  )
})
