import { ObjectId } from 'mongodb'

export type FlightType = {
  _id: ObjectId,
  departureTime: string,
  arrivalTime: string,
  flyingFrom: string,
  flyingTo: string,
  airplaneId: string,
  defaultPrice: number,
}

export const FlightRequestBody = {
  departureTime: '',
  arrivalTime: '',
  flyingFrom: '',
  flyingTo: '',
  airplaneId: '',
  defaultPrice: '',
}