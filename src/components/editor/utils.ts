import { toJS } from "mobx"
import { GarmentRect } from "../../screens/outfit/OutfitEditorScreen"
import { OutfitItem, OutfitItemRect } from "../../stores/OutfitStore"
import { ImageType } from "../../models"
import { Skia } from "@shopify/react-native-skia"
import { getImageSource } from "../../utils"

export const rectFromItem = (item: OutfitItem) => {
    return {
      ...item.rect.getParams(),
      image: toJS(item.image),
      payload: item.garmentUUID
    }
}

export const itemFromRect = (r: GarmentRect) => {
    return new OutfitItem({
        garmentUUID: r.payload,
        rect: new OutfitItemRect({
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          angle: r.angle,
          scale: r.scale,
        })
    })
}

export const loadSkImage = (image: ImageType) => {
    const source = getImageSource(image).uri
    return Skia.Data.fromURI(source)
      .then(data => {
        return Skia.Image.MakeImageFromEncoded(data)
      })
      .catch(err => {
        console.error(err)
        return null;
      })
}
