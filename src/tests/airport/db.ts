import Airplane from '../../app/modules/airplane/airplane.model';

export const airplane1 = new Airplane({
  name: 'Airplane1',
  seats: [
    {
      seatName: 'A1',
      price: 50
    },
    {
      seatName: 'A2',
      price: 40
    },
    {
      seatName: 'A3',
      price: 30
    },
  ]
})

export const setUpDatabase = async () => {
  await Airplane.deleteMany();
  await airplane1.save();
}