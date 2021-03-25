# Discotheque 2

Yet another general-purpose Discord bot. WIP, of course. 

## Setup

### Requirements

- Node 12.x or later and Yarn
- An empty Postgres database

### Procedure

- Copy `.env.example` to `.env` and fill out the `Bot Configuration` section.
  - Optionally fill in the Docker Compose values if using the Compose extras.
- Run `yarn prisma migrate deploy` to set up the database.
- Run `yarn build` to compile the source.
- Run `yarn disco client add --name <client_name> --token <client_token>` to add a bot client.
  - Clients can be added while the bot is running, but it must be restarted to take effect.
- Run `yarn start` to start the bot.
