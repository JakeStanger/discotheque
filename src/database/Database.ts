import { MongoClient, Db, MongoError } from 'mongodb';
import { Logger } from '../utils/Logger';
import collections, { ICollection } from './Collections';

class Database extends Logger {
  private static instance: Database;

  private _client!: MongoClient;
  private _db!: Db;

  public get client() {
    return this._client;
  }

  public get db() {
    return this._db;
  }

  private constructor() {
    super();
    Database.instance = this;

    this.ensureCollection = this.ensureCollection.bind(this);
  }

  public static get() {
    return Database.instance || new Database();
  }

  public async connect(url: string, database: string) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    Database.log('Connected to database');

    const db = client.db(database);

    this._client = client;
    this._db = db;

    await Promise.all(collections.map(this.ensureCollection));

    Database.log('Collections configured');
  }

  private async ensureCollection(collection: ICollection) {
    const dbCollection = await this.db.createCollection(collection.name);
    await dbCollection
      .createIndexes(collection.indexes)
      .catch((err: MongoError) => {
        console.error(err);
      });
  }
}

export default Database;
