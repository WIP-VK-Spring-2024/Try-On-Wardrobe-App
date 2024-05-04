import React from "react";
import { SharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { RectangleWithIndex } from "./models";
import { GestureDetectorView } from "./GestureDetectorView";
import { NativeGesture } from "react-native-gesture-handler";

interface GestureDetectorViewListProps {
  positions: SharedValue<RectangleWithIndex[]>
  getPanGesture: (id: number)=>NativeGesture
}

export const GestureDetectorViewList = observer((props: GestureDetectorViewListProps) => {
  return (
    <>
      {
        props.positions.value.map((_, i) => {
          return (
            <GestureDetectorView 
              key={i} 
              gesture={props.getPanGesture(i)} 
              positions={props.positions} 
              id={i}
            />
          )
        })
      }
    </>
  )
})
