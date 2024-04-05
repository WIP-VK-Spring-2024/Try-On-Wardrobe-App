import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Rectangle } from './models';
import { Image, Rect, SkImage, Skia, vec } from '@shopify/react-native-skia';

export const EditorItem = observer((props: {
  id: number, 
  positions: SharedValue<Rectangle[]>,
  imageUri: string
}) => {
  const [image, setImage] = useState<SkImage | null>(null);
  
  useEffect(() => {
    Skia.Data.fromURI(props.imageUri)
      .then(data => {
        console.log('fetched data', props.imageUri)
        setImage(Skia.Image.MakeImageFromEncoded(data))
      })
      .catch(err => console.error(err))
  }, [])

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
      image === null 
      ? <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        transform={tranforms}
        origin={origin}
      />
      : <Image
          image={image}
          x={x}
          y={y}
          width={width}
          height={height}
          transform={tranforms}
          origin={origin}
      />
  )
});
