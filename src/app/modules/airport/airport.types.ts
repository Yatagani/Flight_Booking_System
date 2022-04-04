import { ObjectId } from 'mongodb';

export type AirportType = {
  _id: ObjectId,
  name: string,
  address: {
    country: string,
    city: string,
    street: string,
    zipCode: number,
    _id: string
  }
}

export type AirportRequestBodyType = {
  name: string,
  address: {
    country: string,
    city: string,
    street: string,
    zipCode: number,
  }
}