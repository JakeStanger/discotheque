import mongoose from 'mongoose';
import { Logger } from '../utils/Logger';
import { Connection } from 'mongoose';

class Database extends Logger {
  private static instance: Database;

  private _db!: Connection;

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
    await mongoose.connect(`${url}/${database}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

    Database.log('Connected to database');

    this._db = mongoose.connection;

    Database.log('Collections configured');
  }
}

export default Database;
