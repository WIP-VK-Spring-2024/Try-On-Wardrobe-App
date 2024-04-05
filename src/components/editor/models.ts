import { ImageType } from "../../models"

export interface RectangleProps {
    x: number,
    y: number,
    angle: number,
    width: number,
    height: number,
    scale: number
}
  
export interface Rectangle extends RectangleProps{
    halfWidth: number,
    halfHeight: number,
    image: ImageType
}
