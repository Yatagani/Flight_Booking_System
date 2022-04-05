type seatType = {
  _id: string,
  seatName: string,
  price: number,
}

export type AirplaneType = {
  _id: string,
  name: string,
  seats: seatType[],
}

export const AirplaneRequestBody = {
  name: '',
  seats: {
    seatName: '',
    price: '',
  },
};
