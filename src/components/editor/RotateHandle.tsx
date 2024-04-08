import { Line, Rect, vec } from '@shopify/react-native-skia';
import React from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { rotateHandleHalfSize, rotateHandleSize } from './consts';

interface RotateHandleCoordsType {
  x: number,
  y: number,
  rx: number,
  ry: number
}

interface RotateHandleProps {
  rotateHandleCoords: SharedValue<RotateHandleCoordsType>,
  activeId: SharedValue<number | undefined>
}

export const RotateHandle = (props: RotateHandleProps) => {
  const rotateHandleX = useDerivedValue(() => {
    return props.rotateHandleCoords.value.x;
  })

  const rotateHandleY = useDerivedValue(() => {
    return props.rotateHandleCoords.value.y
  })

  const rotateLineP1 = useDerivedValue(() => {
    return vec(
      props.rotateHandleCoords.value.x + rotateHandleHalfSize, 
      props.rotateHandleCoords.value.y + rotateHandleHalfSize
    )
  })

  const rotateLineP2 = useDerivedValue(() => {
    return vec(
      props.rotateHandleCoords.value.rx, 
      props.rotateHandleCoords.value.ry
    )
  })

  return (
    <>
      <Rect 
        x={rotateHandleX}
        y={rotateHandleY}
        width={rotateHandleSize}
        height={rotateHandleSize}
        color="lightblue"
      />
      <Line
        p1={rotateLineP1}
        p2={rotateLineP2}
        color="lightblue"
        strokeWidth={4}
      />
    </>
  )
}
