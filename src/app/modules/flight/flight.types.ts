import { ObjectId } from 'mongodb'

export type FlightType = {
  _id: ObjectId,
  departureTime : string,
  arrivalTime : string,
  flyingFrom : ObjectId,
  flyingTo : ObjectId,
  airplaneId : ObjectId,
  defaultPrice : number,
}