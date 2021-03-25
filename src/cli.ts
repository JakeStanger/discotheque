#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';

const argv = yargs(hideBin(process.argv))
  .command('client', 'operate on the list of clients', (builder) =>
    builder
      .command('add', 'add a new client', (subBuilder) =>
        subBuilder
          .option('name', {
            alias: 'n',
            desc: 'A name for the client',
            required: true,
          })
          .option('token', {
            alias: 't',
            desc: 'The login token',
            required: true,
          })
      )
      .strictCommands()
      .demandCommand(1)
  )
  .strictCommands()
  .demandCommand(1).argv;

async function run() {
  const modulePath = path.join(__dirname, 'cli', ...(argv._ as string[]));
  const func = await import(modulePath).then((m) => m.default);

  await func(argv);
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
