import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const videos = getCollectionFn('videos');
export const collections = getCollectionFn('collections');
export const users = getCollectionFn('users');
