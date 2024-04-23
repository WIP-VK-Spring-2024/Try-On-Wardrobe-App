import { ImageType } from "../models"

export enum Rating {
  None = 0,
  Like = 1,
  Dislike = -1,
}

export type Gender = 'male' | 'female'

export type Privacy = 'private' | 'public'

export interface PostData {
  uuid: string
  outfit_id: string
  outfit_image: ImageType
  created_at: string
  user_name: string
  user_rating: number
  rating: number
  user_id: string
}
  