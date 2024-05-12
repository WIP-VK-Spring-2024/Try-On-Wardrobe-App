import React, { useDebugValue } from 'react'
import { Gesture, GestureDetector, NativeGesture } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Rectangle, RectangleWithIndex } from './models';

type idSharedValue = SharedValue<number | undefined>;

interface GestureDetectorViewProps {
  positions: SharedValue<Rectangle[]>
  movingId: idSharedValue
  activeId: idSharedValue
  cursorPosition: SharedValue<{x: number, y: number}>
  basePosition: {x: number, y: number, w: number, h: number}
  id: number
}

export const GestureDetectorView = (props: GestureDetectorViewProps) => {
  const gesture = Gesture.Native()
    .onTouchesDown((event) => {
      const touch = event.allTouches[0];

      props.movingId.value = props.id;
      props.activeId.value = props.id;

      const c = {
        x: props.positions.value[props.id].halfWidth,
        y: props.positions.value[props.id].halfHeight
      }

      const cursor = {
        x: touch.x,
        y: touch.y
      }

      const centerCursor = {
        x: cursor.x - c.x,
        y: cursor.y - c.y
      };

      const {scale, angle} = props.positions.value[props.id];

      props.cursorPosition.value = {
        x: c.x + (centerCursor.x * Math.cos(angle) - centerCursor.y * Math.sin(angle)) * scale,
        y: c.y + (centerCursor.x * Math.sin(angle) + centerCursor.y * Math.cos(angle)) * scale
      };

      const coords = {
        x: touch.absoluteX - props.basePosition.x - props.cursorPosition.value.x,
        y: touch.absoluteY - props.basePosition.y - props.cursorPosition.value.y
      };

      const oldPositions = [...props.positions.value];

      oldPositions[props.id].x = coords.x;
      oldPositions[props.id].y = coords.y;

      props.positions.value = oldPositions;
    })
    .onTouchesMove((event) => {
      const touch = event.allTouches[0];

      const coords = {
        x: touch.absoluteX - props.basePosition.x - props.cursorPosition.value.x,
        y: touch.absoluteY - props.basePosition.y - props.cursorPosition.value.y
      };

      const oldPositions = [...props.positions.value];

      oldPositions[props.id].x = coords.x;
      oldPositions[props.id].y = coords.y;

      props.positions.value = oldPositions;
    })
    .onTouchesUp((event) => {
      props.movingId.value = undefined;
    })

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
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}/>
    </GestureDetector>
  )
}
