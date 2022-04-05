export type BookingResponseType = {
  _id: string,
  departureTime: string,
  arrivalTime: string,
  flyingFrom: string,
  flyingTo: string,
  airplaneName: string,
  price: number,
  seat: string,
  passanger: string
}

export type BookingRequestType = {
  flightId: string,
  userId: string,
  seat: string
}

export type BookingObject = {
  passangerFullName: string,
  flyingFrom: string,
  flyingTo: string,
  departureTime: string,
  flightId: string,
  seat: string,
  price: string,
}
