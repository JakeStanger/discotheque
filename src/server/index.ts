import dotenv from 'dotenv';
import ClientManager from './discord/ClientManager';
import Database from './database/Database';
import HTTPServer from './http/HTTPServer';
import './modules/Modules';
import Log from './utils/Logger';

dotenv.config();

async function boot() {
  const config = process.env;

  const logger = Log.get('Boot');

  const discordTokens = config.DISCORD_TOKENS?.split(' ');
  if (!discordTokens) {
    throw new Error(
      'Missing discord token. Please specify at least one using DISCORD_TOKENS.'
    );
  }

  if (!config.MONGO_DATABASE) {
    throw new Error(
      'Missing mongo database. Please specify using MONGO_DATABASE'
    );
  }

  await Database.get().connect(
    `mongodb://${config.MONGO_HOST || 'localhost'}:${config.MONGO_PORT ||
      27017}`,
    config.MONGO_DATABASE
  );

  HTTPServer.get().listen();

  discordTokens.forEach(ClientManager.addClient);
  await ClientManager.loginClients();

  // do loading stuff

  await ClientManager.alertLoaded();

  logger.log('Startup complete');
}

boot().catch(err => {
  console.error(err);
  process.exit(1);
});
