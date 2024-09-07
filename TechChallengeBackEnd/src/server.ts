import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import app from "./app"
import * as http from "http";

AppDataSource.initialize().then(async () => {
  console.log('Database OK');
  app.listen(4000, () => {
      console.log('Server started on port 4000');
  })
})

export default app;