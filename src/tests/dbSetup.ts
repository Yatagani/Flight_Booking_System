import User from '../app/modules/user/user.model';
import Airplane from '../app/modules/airplane/airplane.model';
import Airport from '../app/modules/airport/airport.model';
import Flight from '../app/modules/flight/flight.model';
import Booking from '../app/modules/booking/booking.model';

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

export const airport1 = new Airport({
  name: 'Airport1',
    address: {
      country: 'Country1',
      city: 'City1',
      street: 'Street1',
      zipCode: 1000,
    },
})

export const airport2 = new Airport({
  name: 'Airport2',
    address: {
      country: 'Country2',
      city: 'City2',
      street: 'Street2',
      zipCode: 1000,
    },
})

export const userAdmin = new User({
  firstName: 'Mario',
  lastName: 'surname',
  email: 'user.admin@test.com',
  password: '$2a$10$7rtQywj81VN48E5FAQ8ywO45dhj.af1iV1i8ue1K38J0JFfP5ZbKG',
  isAdmin: true,
  isConfirmed: true,
  confirmationToken: '6ebf857682f81a0207a6f65c367b0fa192fb4135b2805f0ddbd45e9edb962c25',
  twoFactorAuth: {
      active: true,
      secret: {
          ascii: '%6xI!%m<}I0wTP2n%TFCz3xpg@9s{&f*',
          hex: '2536784921256d3c7d4930775450326e255446437a337870674039737b26662a',
          base32: 'EU3HQSJBEVWTY7KJGB3VIUBSNYSVIRSDPIZXQ4DHIA4XG6ZGMYVA',
          otpauth_url: 'otpaut://totp/SecretKey?secret=EU3HQSJBEVWTY7KJGB3VIUBSNYSVIRSDPIZXQ4DHIA4XG6ZGMYVA',
      }
  }
})

export const userNotAdmin = new User({
  firstName: 'Name',
  lastName: 'surname',
  email: 'test.test@gmail.com',
  password: '$2a$10$7rtQywj81VN48E5FAQ8ywO45dhj.af1iV1i8ue1K38J0JFfP5ZbKG',
  isAdmin: false,
  isConfirmed: true,
  confirmationToken: '6ebf857682f81a0207a6f65c367b0fa192fb4135b2805f0ddbd45e9edb962c25',
  twoFactorAuth: {
      active: true,
      secret: {
          ascii: '%6xI!%m<}I0wTP2n%TFCz3xpg@9s{&f*',
          hex: '2536784921256d3c7d4930775450326e255446437a337870674039737b26662a',
          base32: 'EU3HQSJBEVWTY7KJGB3VIUBSNYSVIRSDPIZXQ4DHIA4XG6ZGMYVA',
          otpauth_url: 'otpaut://totp/SecretKey?secret=EU3HQSJBEVWTY7KJGB3VIUBSNYSVIRSDPIZXQ4DHIA4XG6ZGMYVA',
      }
  }
})

export const flight = new Flight({
  departureTime: '12:00',
  arrivalTime: '13:00',
  flyingFrom: airport1._id,
  flyingTo: airport2._id,
  airplaneId: airplane1._id,
  defaultPrice: 1000
})

export const clearDB = async () => {
  await Airplane.deleteMany({});
  await Airport.deleteMany({});
  await Flight.deleteMany({});
  await User.deleteMany({});
  await Booking.deleteMany({});
}

export const setUpDatabase = async () => {
  await airplane1.save();
  await airport1.save();
  await airport2.save();
  await flight.save();
  await userAdmin.save();
  await userNotAdmin.save();
}
