import request from 'supertest';
import { initExpressApp } from '../app';
import routes from '../app/constants/routes';

let app;

beforeAll(async () => {
  app = await initExpressApp();
});

test(`Test "Health" endpoint`, async () => {
  await request(app)
    .get(`${routes.BASE}${routes.HEALTH}`)
    .expect(200);
});