import React from 'react'
import { GestureDetector, NativeGesture } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Rectangle } from './models';

export const GestureDetectorView = (props: {gesture: NativeGesture, positions: SharedValue<Rectangle[]>, id: number}) => {
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",

      top: props.positions.value[props.id].y,
      left: props.positions.value[props.id].x,

      width: props.positions.value[props.id].width,
      height: props.positions.value[props.id].height,

      transform: [
        {"rotate": `${props.positions.value[props.id].angle}rad`},
        {"scale": props.positions.value[props.id].scale},
      ]
    }
  }
  );

  return (
    <GestureDetector gesture={props.gesture}>
      <Animated.View style={style}/>
    </GestureDetector>
  )
}
