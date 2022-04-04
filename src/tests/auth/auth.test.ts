/* eslint-disable no-undef */
import request from 'supertest';
import Crypto from 'crypto';
import Bcrypt from 'bcryptjs';
import {initExpressApp} from '../../app';
import errors from '../../app/constants/errors';
import { createToken } from '../../app/config/authentication/jwt';
import routes from '../../app/constants/routes';
import * as dal from '../../app/modules/authentication/auth.dal';
import { clearDB, setUpDatabase } from '../dbSetup';

let app;

beforeAll(async () => {
  app = await initExpressApp();
  await clearDB();
  await setUpDatabase();
});

afterAll(async() => {
  await clearDB();
})

test('Register a user with success', async () => {
  const body = {
    firstName: 'Firstname',
    lastName: 'LastName',
    email: 'random.mail@gmail.com',
    password: 'Test1234',
    redirectUrl: 'localhost:3000',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/register`)
    .send(body);    

  expect(response.status).toEqual(204);
});

test('Register a user with invalid data - duplicated email', async () => {
  const body = {
    firstName: 'Firstname',
    lastName: 'LastName',
    email: 'random.mail@gmail.com',
    password: 'Test1234',
    redirectUrl: 'localhost:3000',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/register`)
    .send(body);

  expect(response.status).toEqual(422);
  expect(response.body.details).toEqual(errors.DUPLICATE_EMAILS);
});

test('Login user without account confirmation', async () => {
  const body = {
    email: 'random.mail@gmail.com',
    password: 'Test1234',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/login`)
    .send(body);

  expect(response.status).toEqual(401);
  expect(response.body.details).toEqual(errors.ACCOUNT_NOT_CONFIRMED);
});

test('Resend confirmation email with success', async () => {
  const body = {
    email: 'random.mail@gmail.com',
    redirectUrl: 'localhost:3000',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/resend-confirmation-email`)
    .send(body);

  expect(response.status).toEqual(204);
});

test('Resend confirmation email with invalid data', async () => {
  const body = {
    email: 'test@mail.com',
    redirectUrl: 'localhost:3000',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/resend-confirmation-email`)
    .send(body);

  expect(response.status).toEqual(404);
  expect(response.body.details).toEqual(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
});

test('Confirm account with success', async () => {
  const query = { email: 'random.mail@gmail.com' };
  const user = await dal.findUser({ query });
  const { confirmationToken } = user;

  const response = await request(app)
    .put(`${routes.BASE}${routes.AUTH}/confirmation?token=${confirmationToken}`);

  expect(response.status).toEqual(204);
});

test('Confirm account with invalid token', async () => {
  const confirmationToken = 'invalidToken';

  const response = await request(app)
    .put(`${routes.BASE}${routes.AUTH}/confirmation?token=${confirmationToken}`);

  expect(response.status).toEqual(404);
  expect(response.body.details).toEqual(errors.USER_NOT_FOUND_OR_ACCOUNT_CONFIRMED);
});

test('Login user with invalid email', async () => {
  const body = {
    email: 'test@mail.com',
    password: 'Test1234',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/login`)
    .send(body);

  expect(response.status).toEqual(401);
  expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
});

test('Login user with invalid password', async () => {
  const body = {
    email: 'test@mail.com',
    password: 'Test',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/login`)
    .send(body);

  expect(response.status).toEqual(401);
  // expect(response.body.details).toEqual(errors.INVALID_PASSWORD);
});

test('Login user with success', async () => {
  const body = {
    email: 'random.mail@gmail.com',
    password: 'Test1234',
  };

  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/login`)
    .send(body);

  const token = createToken(response.body);

  expect(response.status).toEqual(200);
  expect(Object.keys(response.body).sort()).toEqual([
    '__v',
    '_id',
    'firstName',
    'lastName',
    'email',
    'isAdmin',
    'isConfirmed',
    'twoFactorAuth',
    'confirmationToken',
    'createdAt',
    'updatedAt',
    'token',
  ].sort());

  expect(response.body.token).toEqual(token);
});

test('Request new password with success', async () => {
  const body = {
    email: 'random.mail@gmail.com',
    redirectUrl: 'localhost:3000',
  };
  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/request-new-password`)
    .send(body);

  expect(response.status).toEqual(204);
});

test('Request new password with invalid user data', async () => {
  const body = {
    email: 'test.test@mail.com',
    redirectUrl: 'localhost:3000',
  };
  const response = await request(app)
    .post(`${routes.BASE}${routes.AUTH}/request-new-password`)
    .send(body);

  expect(response.status).toEqual(404);
  expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
});

test('Reset Password with success', async () => {
  const query = { email: 'random.mail@gmail.com' };
  const user = await dal.findUser({ query });

  const body = {
    token: user.confirmationToken,
    password: 'Test12345',
  };

  const response = await request(app)
    .put(`${routes.BASE}${routes.AUTH}/password`)
    .send(body);

  expect(response.status).toEqual(204);

  const updatedUser = await dal.findUser({ query });
  const passwordMatch = Bcrypt.compareSync(body.password, updatedUser.password);

  expect(passwordMatch).toEqual(true);
});

test('Reset Password with invalid user data', async () => {
  const body = {
    token: Crypto.randomBytes(32).toString('hex'),
    password: 'Test12345',
  };

  const response = await request(app)
    .put(`${routes.BASE}${routes.AUTH}/password`)
    .send(body);

  expect(response.status).toEqual(404);
  expect(response.body.details).toEqual(errors.USER_NOT_FOUND);
});