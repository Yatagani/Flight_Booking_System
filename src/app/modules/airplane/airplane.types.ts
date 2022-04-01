type seatType = {
  _id: string,
  seatName: string,
  price: string,
}

export type AirplaneType = {
  _id: string,
  name: string,
  seats: seatType[],
}