import { SkImage } from "@shopify/react-native-skia"
import { ImageType } from "../../models"

export interface RectangleProps {
    x: number,
    y: number,
    angle: number,
    width: number,
    height: number,
    scale: number,
    zIndex: number,
}
  
export interface Rectangle extends RectangleProps {
    halfWidth: number,
    halfHeight: number,
    // image?: ImageType,
}

export interface RectangleWithIndex extends Rectangle {
    index: number
}

export interface RectangleWithPayload<T> extends Rectangle {
    payload: T,
}
