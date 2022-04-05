import { initExpressApp } from './app';

const port = process.env.PORT;

(async () => {
  const app = await initExpressApp();
  app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });
})();
