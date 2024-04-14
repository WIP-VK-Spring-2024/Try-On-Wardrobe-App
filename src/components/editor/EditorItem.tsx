import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { Rectangle } from './models';
import { Image, Rect, SkImage, Skia, vec } from '@shopify/react-native-skia';
import { getImageSource } from '../../utils';
import { ImageType } from '../../models';

export const EditorItem = observer((props: {
  id: number, 
  positions: SharedValue<Rectangle[]>,
  image?: ImageType
}) => {
  const [skImage, setImage] = useState<SkImage | null>(null);
  
  useEffect(() => {
    console.log('fetch', props.image)
    if (props.image === undefined) {
      return;
    }

    const source = getImageSource(props.image).uri
    console.log(source)
    Skia.Data.fromURI(source)
      .then(data => {
        console.log('fetched data', props.image!.uri)
        setImage(Skia.Image.MakeImageFromEncoded(data))
      })
      .catch(err => console.error(err))
  }, [props.image])

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
    skImage === null 
      ? <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        transform={tranforms}
        origin={origin}
      />
      : <Image
          image={skImage}
          x={x}
          y={y}
          width={width}
          height={height}
          transform={tranforms}
          origin={origin}
      />
  )
});
