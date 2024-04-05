import { Rect } from '@shopify/react-native-skia';
import React from 'react';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { scaleHandleHalfSize, scaleHandleSize } from './consts';


interface ScaleHandleProps {
  coords: SharedValue<{x: number, y: number, rx: number, ry: number}>
}

export const ScaleHandle = (props: ScaleHandleProps) => {
  const x = useDerivedValue(() => props.coords.value.x + props.coords.value.rx - scaleHandleHalfSize);
  const y = useDerivedValue(() => props.coords.value.y + props.coords.value.ry - scaleHandleHalfSize);

  return (
    <Rect
      x={x}
      y={y}
      width={scaleHandleSize}
      height={scaleHandleSize}
      color="lightblue"
    />
  )
}
