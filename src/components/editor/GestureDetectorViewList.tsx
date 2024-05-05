import React, { useEffect, useState } from "react";
import Animated, { SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { RectangleWithIndex } from "./models";
import { GestureDetectorView } from "./GestureDetectorView";
import { NativeGesture } from "react-native-gesture-handler";
import { toJS } from "mobx";

interface GestureDetectorViewListProps {
  positions: SharedValue<RectangleWithIndex[]>
  getPanGesture: (id: number)=>NativeGesture
}

export const GestureDetectorViewList = observer((props: GestureDetectorViewListProps) => {
  return (
    <>
      {
        props.positions.value.map((item, i) => {
          return (
            <GestureDetectorView 
              key={i} 
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
