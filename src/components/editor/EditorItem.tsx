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
  const x = useDerivedValue(() => props.positions.value[props.id]?.x || 0);
  const y = useDerivedValue(() => props.positions.value[props.id]?.y || 0);

  const width = useDerivedValue(() => props.positions.value[props.id]?.width || 0);
  const height = useDerivedValue(() => props.positions.value[props.id]?.height || 0);

  const origin = useDerivedValue(() => {
    return vec(
      x.value + props.positions.value[props.id]?.halfWidth || 0, 
      y.value + props.positions.value[props.id]?.halfHeight || 0,
    )
  })

  const tranforms = useDerivedValue(() => {
    return [
      {rotate: props.positions.value[props.id]?.angle || 0},
      {scale: props.positions.value[props.id]?.scale || 0},
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
