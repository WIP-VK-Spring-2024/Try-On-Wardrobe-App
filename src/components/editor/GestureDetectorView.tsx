import React, { useDebugValue } from 'react'
import { GestureDetector, NativeGesture } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Rectangle } from './models';

interface GestureDetectorViewProps {
  gesture: NativeGesture
  positions: SharedValue<Rectangle[]>
  id: number
}

export const GestureDetectorView = (props: GestureDetectorViewProps) => {
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",

      top: props.positions.value[props.id]?.y || 0,
      left: props.positions.value[props.id]?.x || 0,

      width: props.positions.value[props.id]?.width || 0,
      height: props.positions.value[props.id]?.height || 0,

      transform: [
        {"rotate": `${props.positions.value[props.id]?.angle || 0}rad`},
        {"scale": props.positions.value[props.id]?.scale || 0},
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
