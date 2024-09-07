import { AppDataSource } from './src/database/data-source';

export default async () => {
  if (AppDataSource.isInitialized) {
    console.log('Teardown: destroying data source');
    await AppDataSource.destroy();
  } else {
    console.log('Teardown: data source is not initialized');
  }
};