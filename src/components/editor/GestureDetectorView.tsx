import React, { useDebugValue } from 'react'
import { Gesture, GestureDetector, NativeGesture } from 'react-native-gesture-handler';
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { Rectangle, RectangleWithIndex } from './models';

type idSharedValue = SharedValue<number | undefined>;

interface GestureDetectorViewProps {
  positions: SharedValue<Rectangle[]>
  sortedPositions: SharedValue<RectangleWithIndex[]>
  movingId: idSharedValue
  activeId: idSharedValue
  cursorPosition: SharedValue<{x: number, y: number}>
  basePosition: {x: number, y: number, w: number, h: number}
  id: number
}

export const GestureDetectorView = (props: GestureDetectorViewProps) => {
  const id = useDerivedValue(() => {
    return props.sortedPositions.value[props.id]?.index || 0;
  })

  const gesture = Gesture.Native()
    .onTouchesDown((event) => {
      const touch = event.allTouches[0];

      props.movingId.value = id.value;
      props.activeId.value = id.value;

      const c = {
        x: props.positions.value[id.value].halfWidth,
        y: props.positions.value[id.value].halfHeight
      }

      const cursor = {
        x: touch.x,
        y: touch.y
      }

      const centerCursor = {
        x: cursor.x - c.x,
        y: cursor.y - c.y
      };

      const {scale, angle} = props.positions.value[id.value];

      props.cursorPosition.value = {
        x: c.x + (centerCursor.x * Math.cos(angle) - centerCursor.y * Math.sin(angle)) * scale,
        y: c.y + (centerCursor.x * Math.sin(angle) + centerCursor.y * Math.cos(angle)) * scale
      };

      const coords = {
        x: touch.absoluteX - props.basePosition.x - props.cursorPosition.value.x,
        y: touch.absoluteY - props.basePosition.y - props.cursorPosition.value.y
      };

      const oldPositions = [...props.positions.value];

      oldPositions[id.value].x = coords.x;
      oldPositions[id.value].y = coords.y;

      props.positions.value = oldPositions;
    })
    .onTouchesMove((event) => {
      const touch = event.allTouches[0];

      const coords = {
        x: touch.absoluteX - props.basePosition.x - props.cursorPosition.value.x,
        y: touch.absoluteY - props.basePosition.y - props.cursorPosition.value.y
      };

      const oldPositions = [...props.positions.value];

      oldPositions[id.value].x = coords.x;
      oldPositions[id.value].y = coords.y;

      props.positions.value = oldPositions;
    })
    .onTouchesUp((event) => {
      props.movingId.value = undefined;
    })

  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",

      top: props.positions.value[id.value]?.y || 0,
      left: props.positions.value[id.value]?.x || 0,

      width: props.positions.value[id.value]?.width || 0,
      height: props.positions.value[id.value]?.height || 0,

      transform: [
        {"rotate": `${props.positions.value[id.value]?.angle || 0}rad`},
        {"scale": props.positions.value[id.value]?.scale || 0},
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
