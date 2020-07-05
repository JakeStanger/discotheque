import { IndexSpecification } from 'mongodb';

export interface ICollection {
  name: string;
  indexes: IndexSpecification[];
}

const collections: ICollection[] = [
  { name: 'guilds', indexes: [{ key: { id: 1 }, unique: true }] },
  {
    name: 'messages',
    indexes: [
      { key: { id: -1 }, unique: true },
      { key: { authorId: 1 } },
      { key: { channelId: 1 } },
      { key: { guildId: 1 } }
    ]
  }
];

export default collections;
