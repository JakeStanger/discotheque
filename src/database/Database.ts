import { MongoClient, Db } from 'mongodb';
import { Logger } from '../utils/Logger';
import collections from './Collections';

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
  }

  public static get() {
    return Database.instance || new Database();
  }

  public async connect(url: string, database: string) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(database);

    this._client = client;
    this._db = db;

    await Promise.all(
      collections.map(collection => db.createCollection(collection))
    );

    Database.log('Connected to database');
  }
}

export default Database;
