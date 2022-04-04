import request from 'supertest';
import app from '../app';
import routes from '../app/constants/routes';

test(`Test "Health" endpoint`, async () => {
  await request(app)
    .get(`${routes.BASE}${routes.HEALTH}`)
    .expect(200)  
});