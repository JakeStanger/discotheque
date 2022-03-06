import express from 'express';
import cors from 'cors';
import DiscordClientManager from '../manager/DiscordClientManager';
import prisma from '../client/prisma';
import { Prisma } from '@prisma/client';
import { GuildChannel, GuildMember } from 'discord.js';

const app = express();
app.use(cors());

export async function init() {
  const port = process.env.API_PORT || 4000;

  await new Promise<void>((resolve) => app.listen(port, resolve));

  console.log(`API listening at http://localhost:${port}`);
}

app.use((req, res, next) => {
  if (
    process.env.API_AUTH_TOKEN &&
    req.headers.authorization !== `Bearer ${process.env.API_AUTH_TOKEN}`
  ) {
    return res.status(401).send({ error: 'Invalid auth token' });
  }

  next();
});

app.get('/guild', async (req, res) => {
  const guilds = await prisma.guild.findMany();

  res.send({ data: guilds });
});

app.get('/guild/:id', async (req, res) => {
  const guild = await prisma.guild.findUnique({ where: { id: req.params.id } });

  res.send({ data: guild });
});

app.get('/guild/:id/member', async (req, res) => {
  const guild = await prisma.guild.findUnique({ where: { id: req.params.id } });

  const discord = await DiscordClientManager.get().get(guild.clientId);

  const members = await discord.guilds
    .resolve(req.params.id)
    .members.fetch()
    .then((mbrs) => mbrs.map(getMember));

  res.send({ data: members });
});

app.get('/guild/:id/member/:mid', async (req, res) => {
  const guild = await prisma.guild.findUnique({ where: { id: req.params.id } });

  const discord = await DiscordClientManager.get().get(guild.clientId);

  const member = getMember(
    await discord.guilds.resolve(req.params.id).members.fetch(req.params.mid)
  );

  res.send({ data: member });
});

app.get('/guild/:id/channel', async (req, res) => {
  const guild = await prisma.guild.findUnique({ where: { id: req.params.id } });

  const discord = await DiscordClientManager.get().get(guild.clientId);

  const channels = await Promise.all(
    discord.guilds.resolve(guild.id).channels.cache.array().map(getChannel)
  );

  res.send({ data: channels });
});

app.get('/guild/:id/channel/:cid', async (req, res) => {
  const guild = await prisma.guild.findUnique({ where: { id: req.params.id } });

  const discord = await DiscordClientManager.get().get(guild.clientId);

  const channel = await getChannel(
    discord.guilds.resolve(guild.id).channels.resolve(req.params.cid)
  );

  res.send({ data: channel });
});

app.get('/guild/:id/channel/:cid/message', async (req, res) => {
  const top = req.query.$top
    ? Math.min(parseInt(req.query.$top as string), 10_000)
    : 5000;

  const skip = parseInt(req.query.$skip as string) || 0;

  const filter: Prisma.MessageWhereInput = req.query.$filter
    ? (() => {
        // eg ?$filter=content startsWith Wordle
        const [, field, operator, operand] = /(\w+) (\w+) (.*)/.exec(
          req.query.$filter as string
        );

        return {
          [field]: { [operator]: operand },
        };
      })()
    : {};

  const messages = await prisma.message.findMany({
    where: { ...filter, guildId: req.params.id, channelId: req.params.cid },
    orderBy: { timestamp: 'desc' },
    take: top,
    skip,
  });

  const aggregate = await prisma.message.aggregate({
    where: { channelId: req.params.cid },
    count: true,
  });

  res.send({ data: messages, aggregate });
});

app.get('/guild/:id/channel/:cid/message/:mid', async (req, res) => {
  const messages = await prisma.message.findUnique({
    where: {
      id: req.params.mid,
    },
  });

  res.send({ data: messages });
});

interface IChannel {
  id: string;
  name: string;
  type: Exclude<keyof typeof ChannelType, 'dm' | 'group' | 'unknown'>;
  messages?: {
    count: number;
  };
}

async function getChannel(channel: GuildChannel): Promise<IChannel> {
  if (channel === null) {
    return null;
  }

  const retObject: IChannel = {
    id: channel.id,
    name: channel.name,
    type: channel.type,
  };

  if (channel.type === 'text') {
    retObject.messages = await prisma.message.aggregate({
      where: { channelId: channel.id },
      count: true,
    });
  }

  return retObject;
}

interface IMember {
  id: string;
  guildId: string;
  displayName: string;
  color: string;
  username: string;
  avatarUrl: string;
}

function getMember(member: GuildMember): IMember {
  if (member === null) {
    return null;
  }

  return {
    id: member.id,
    guildId: member.guild.id,
    color: member.displayHexColor,
    displayName: member.displayName,
    username: member.user.username,
    avatarUrl: member.user.displayAvatarURL(),
  };
}
