import serverlessExpress from '@vendia/serverless-express';
import { createNestApp } from './src/main-nest';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

let cachedHandler: ReturnType<typeof serverlessExpress>;

export async function handler(event: any, context: any) {
  if (!cachedHandler) {
    const app = await createNestApp();
    await app.init();
    const expressInstance = app.getHttpAdapter().getInstance();
    cachedHandler = serverlessExpress({ app: expressInstance });
  }

  return cachedHandler(event, context);
}
