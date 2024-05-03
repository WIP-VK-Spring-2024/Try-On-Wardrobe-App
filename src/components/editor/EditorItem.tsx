import React from 'react';
import { observer } from 'mobx-react-lite';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Rectangle } from './models';
import { Image, Rect, SkImage, vec } from '@shopify/react-native-skia';

export const EditorItem = observer((props: {
  id: number,
  positions: SharedValue<Rectangle[]>,

  skImage: SharedValue<SkImage | null>
}) => {
  const x = useDerivedValue(() => props.positions.value[props.id].x);
  const y = useDerivedValue(() => props.positions.value[props.id].y);

  const width = useDerivedValue(() => props.positions.value[props.id].width);
  const height = useDerivedValue(() => props.positions.value[props.id].height);

  const origin = useDerivedValue(() => {
    return vec(
      x.value + props.positions.value[props.id].halfWidth, 
      y.value + props.positions.value[props.id].halfHeight,
    )
  })

  const tranforms = useDerivedValue(() => {
    return [
      {rotate: props.positions.value[props.id].angle},
      {scale: props.positions.value[props.id].scale},
    ]
  })

  return (
    props.skImage === null  || props.skImage === undefined
      ? <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        transform={tranforms}
        origin={origin}
      />
      : <Image
          image={props.skImage}
          x={x}
          y={y}
          width={width}
          height={height}
          transform={tranforms}
          origin={origin}
      />
  )
});
