import { toJS } from "mobx"
import { GarmentRect } from "../../screens/OutfitEditorScreen"
import { OutfitItem, OutfitItemRect } from "../../stores/OutfitStore"

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
        scale: r.scale
        })
    })
}
