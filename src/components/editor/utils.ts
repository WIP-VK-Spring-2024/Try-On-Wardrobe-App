import { toJS } from "mobx"
import { GarmentKitItem, GarmentKitItemRect } from "../../stores/GarmentKitStore"
import { GarmentRect } from "../../screens/KitEditorScreen"

export const rectFromItem = (item: GarmentKitItem) => {
    return {
      ...item.rect.getParams(),
      image: toJS(item.image),
      payload: item.garmentUUID
    }
}

export const itemFromRect = (r: GarmentRect) => {
    return new GarmentKitItem({
        garmentUUID: r.payload,
        rect: new GarmentKitItemRect({
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        angle: r.angle,
        scale: r.scale
        })
    })
}
