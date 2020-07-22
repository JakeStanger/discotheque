import Command from '../../../utils/Command';
import ICommandDefinition from '../../../utils/ICommandDefinition';
import {
  Collection,
  Guild,
  GuildMember,
  Message,
  MessageReaction,
  Snowflake
} from 'discord.js';
import Module from '../../../utils/Module';
import IDistrictMember from './IDistrictMember';
import DiscordUtils from '../../../discord/DiscordUtils';
import { shuffle } from 'lodash';
import IEvent, { HungerGamesEvent } from './database/schema/IEvent';
import EventType from './events/EventType';
import Positive from './events/Positive';
import { randomElement, randomEnum, rng } from '../../../utils/Functions';
import Negative from './events/Negative';
import Neutral from './events/Neutral';
// import { ensureEvents } from './database/PopulateEvents';
// import { ensureItems } from './database/PopulateItems';
import IItem, { HungerGamesItem } from './database/schema/IItem';
import ItemType from './items/ItemType';

class HungerGames extends Command {
  public readonly games: Collection<
    Snowflake,
    Collection<Snowflake, IDistrictMember>
  >;

  public constructor(module: Module) {
    super(module);
    this.games = new Collection();

    // TODO: Migrate these to their own command
    // ensureEvents().catch(console.error);
    // ensureItems().catch(console.error);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'hungerGames',
      description: 'Find out which member is strongest'
    };
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    const debugMode = args[0] === '--debug';

    const guildMembers = await message.guild?.members.fetch();
    if (!guildMembers || !message.guild) {
      await DiscordUtils.sendError(
        message.channel,
        'You can only play this inside a guild.'
      );
      return;
    }

    if (this.games.get(message.guild.id)) {
      await DiscordUtils.sendError(
        message.channel,
        'A game is already running.'
      );
      return;
    }

    const events = await HungerGamesEvent.find();
    const items = await HungerGamesItem.find();

    await this.setup(message.guild, guildMembers, items);

    let day = 1;
    do {
      await this.displayDistricts(message, day, day === 1, debugMode);

      const alive = this.getAlive(message.guild);
      if (!alive) return;

      for (const member of alive.values()) {
        // if died already during the day
        if (member.health === 0) {
          continue;
        }

        const getRandomEvent = (
          eventType: EventType,
          category?: Positive | Neutral | Negative
        ) => this.getRandomEvent(member, events, eventType, category);

        let event: IEvent | undefined;
        let item: IItem | undefined;

        let victor: IDistrictMember | undefined;
        let loser: IDistrictMember | undefined;

        // handle low stats
        if (member.hunger === 0) {
          if (HungerGames.getFoodPoints(member) > 0) {
            const food = member.food.pop();
            member.hunger += 20 * food!.strength;
          } else {
            member.health -= 50;
          }
        }

        if (member.stamina === 0) {
          member.health -= 30;
          member.stamina += 70;

          event = await getRandomEvent(EventType.Neutral, Neutral.Rest);
        } else {
          const doEncounter = (await rng(0, 100)) < 12;
          if (doEncounter) {
            event = await getRandomEvent(EventType.Encounter);

            const encounter = alive
              .filter(m => m.health > 0 && m.member.id !== member.member.id)
              .sort(() => Math.random() - 0.5)
              .first();

            if (!member || !encounter) {
              continue; // Something went wrong!
            }

            const memberStrength = HungerGames.getTotalStrength(member);
            const encounterStrength = HungerGames.getTotalStrength(encounter);

            const strengthDifference = memberStrength - encounterStrength;
            const strengthTotal = memberStrength + encounterStrength;

            const chanceMultiplier = Math.round(
              (strengthDifference / strengthTotal) * 100
            );

            // TODO: Winner takes loser's items if better

            if ((await rng(0, 100)) < 50 + chanceMultiplier) {
              encounter.health = 0;
              victor = member;
              loser = encounter;
            } else {
              member.health = 0;
              victor = encounter;
              loser = member;
            }
          } else {
            const eventRn = await rng(0, 20);
            const eventType =
              eventRn < 10 ? EventType.Positive : EventType.Negative;

            switch (eventType) {
              case EventType.Positive: {
                const eventCategory = await randomEnum(Positive);
                event = await getRandomEvent(EventType.Positive, eventCategory);
                switch (eventCategory) {
                  case Positive.FindWeapon:
                    const newWeapon = await this.getRandomItem(
                      items,
                      ItemType.Weapon
                    );
                    if (
                      !member.weapon ||
                      newWeapon.strength > member.weapon.strength
                    ) {
                      item = newWeapon;
                      member.weapon = newWeapon;
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }

                    break;
                  case Positive.FindArmour:
                    const newArmour = await this.getRandomItem(
                      items,
                      ItemType.Armour
                    );
                    if (
                      !member.armour ||
                      newArmour.strength > member.armour.strength
                    ) {
                      item = newArmour;
                      member.armour = newArmour;
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }
                    break;
                  case Positive.FindFood:
                    const newFood = await this.getRandomItem(
                      items,
                      ItemType.Food
                    );
                    if (HungerGames.getFoodPoints(member) < 5) {
                      member.food.push(newFood);
                      item = newFood;
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }

                    break;
                }
                break;
              }

              case EventType.Negative: {
                const eventCategory = await randomEnum(Negative);
                event = await getRandomEvent(EventType.Negative, eventCategory);
                switch (eventCategory) {
                  case Negative.LoseWeapon:
                    if (member.weapon) {
                      item = member.weapon;
                      member.weapon = undefined;
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }

                    break;
                  case Negative.LoseArmour:
                    if (member.armour) {
                      item = member.armour;
                      member.armour = undefined;
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }

                    break;
                  case Negative.LoseFood:
                    if (HungerGames.getFoodPoints(member) > 0) {
                      item = member.food.pop();
                    } else {
                      event = await getRandomEvent(
                        EventType.Neutral,
                        Neutral.Nothing
                      );
                    }

                    break;
                }
                break;
              }
            }
          }
        }

        // ambient decrease per turn
        member.health -= 5;
        member.hunger -= 10;
        member.stamina -= 10;

        if (event?.statChanges?.health?.length) {
          member.health += await rng(
            event?.statChanges?.health[0],
            event?.statChanges?.health[1]
          );
        }

        if (event?.statChanges?.hunger?.length) {
          member.hunger += await rng(
            event?.statChanges?.hunger[0],
            event?.statChanges?.hunger[1]
          );
        }

        if (event?.statChanges?.stamina?.length) {
          member.stamina += await rng(
            event?.statChanges?.stamina[0],
            event?.statChanges?.stamina[1]
          );
        }

        if (member.health < 0) {
          member.health = 0;
        }

        if (member.hunger < 0) {
          member.hunger = 0;
        }

        if (member.stamina < 0) {
          member.stamina = 0;
        }

        // cap stats at 100
        if (member.health > 100) {
          member.health = 100;
        }

        if (member.hunger > 100) {
          member.hunger = 100;
        }

        if (member.stamina > 100) {
          member.stamina = 100;
        }

        await DiscordUtils.sendEmbed(message.channel, {
          description: event?.description
            .replace(/%name%/g, `**${member.member.displayName}**`)
            .replace(/%victor%/g, `**${victor?.member.displayName}**`)
            .replace(/%loser%/g, `**${loser?.member.displayName}**`)
            .replace(/%weapon%/g, `**${item?.name || victor?.weapon?.name}**`)
            .replace(/%armour%/g, `**${item?.name}**`)
            .replace(/%food%/g, `**${item?.name}**`),
          color: member.member.displayColor,
          fields: debugMode
            ? [
                {
                  name: 'Health',
                  value: member.health,
                  inline: true
                },
                {
                  name: 'Hunger',
                  value: member.hunger,
                  inline: true
                },
                {
                  name: 'Stamina',
                  value: member.stamina,
                  inline: true
                },
                {
                  name: 'Strength',
                  value: member.strength,
                  inline: true
                },
                {
                  name: 'Weapon',
                  value: member.weapon?.name || '-',
                  inline: true
                },
                {
                  name: 'Armour',
                  value: member.armour?.name || '-',
                  inline: true
                },
                {
                  name: 'Food',
                  value: `${member.food
                    .map(f => f.name)
                    .join(', ')} (${HungerGames.getFoodPoints(member)})`,
                  inline: true
                }
              ]
            : []
        });

        if (member.health === 0) {
          await DiscordUtils.sendError(
            message.channel,
            `${member.member.displayName} dies.`
          );
        }

        // handle encounters dying
        if (member.member.id !== loser?.member.id && loser?.health === 0) {
          await DiscordUtils.sendError(
            message.channel,
            `${loser.member.displayName} dies.`
          );
        }
      }

      // alive = this.getAlive(message.guild);
      day++;
    } while (this.getAlive(message.guild)!.size > 1);

    await DiscordUtils.sendSuccess(
      message.channel,
      `${
        this.getAlive(message.guild)!.first()!.member.displayName
      } is the winner`
    );
  }

  /**
   * Gets alive members in a random order
   * @param guild
   */
  private getAlive(guild: Guild) {
    return this.games
      .get(guild.id)
      ?.filter(member => member.health > 0)
      .sort(() => Math.random() - 0.5);
  }

  private async setup(
    guild: Guild,
    guildMembers: Collection<Snowflake, GuildMember>,
    items: IItem[]
  ) {
    let members = guildMembers
      .filter(m => m.hasPermission('VIEW_CHANNEL'))
      .array();
    members = shuffle(members);

    const districtMembers = new Collection<Snowflake, IDistrictMember>();
    for (const i in members) {
      const member = members[i];
      districtMembers.set(member.id, {
        member,
        district: Math.floor(parseInt(i) / 2),
        health: await rng(80, 100),
        hunger: await rng(80, 100),
        stamina: await rng(80, 100),
        strength: await rng(70, 100),

        weapon:
          (await rng(0, 10)) !== 0
            ? await this.getRandomItem(items, ItemType.Weapon)
            : undefined,
        armour: undefined,
        food:
          (await rng(0, 2)) === 0
            ? [await this.getRandomItem(items, ItemType.Food)]
            : []
      });
    }

    this.games.set(guild.id, districtMembers);
  }

  private async displayDistricts(
    message: Message,
    day: number,
    timeOut: boolean,
    debug: boolean
  ): Promise<boolean> {
    const districtMembers = this.games.get(message.guild!.id)!;
    const numDistricts = Math.ceil(districtMembers.size / 2);

    const embedFields = [...Array(numDistricts).keys()]
      .map(i =>
        districtMembers
          .filter(m => m.district === i)
          .map(
            m =>
              `${m.health === 0 ? '~~' : ''}${m.member.displayName}${
                m.health === 0 ? '~~' : ''
              }`
          )
          .join('\n')
      )
      .map((members, i) => ({ name: `District ${i + 1}`, value: members }));

    const districts = await DiscordUtils.sendOngoing(message.channel, {
      title: `Day ${day}`,
      description: 'React to continue.',
      fields: embedFields
    });

    // skip react in debug mode
    if (debug) {
      return true;
    }

    const react = await districts.awaitReactions(
      (r: MessageReaction) => !!r.count && r.count > 0,
      { time: timeOut ? 300_000 : undefined, max: 1 }
    );

    return !!react;
  }

  private static getTotalStrength(member: IDistrictMember) {
    let strength = member.strength;
    if (member.weapon) strength += member.weapon.strength;
    if (member.armour) strength += member.armour.strength;
    return strength;
  }

  private static getFoodPoints(member: IDistrictMember): number {
    if (!member.food.length) return 0;
    const points = member.food
      .map(m => m.strength)
      .reduce((total, points) => total + points);

    if (points > 5) {
      return 5;
    }

    if (points < 0) {
      return 0;
    }

    return points;
  }

  private async getRandomEvent(
    member: IDistrictMember,
    events: IEvent[],
    eventType: EventType,
    category?: Positive | Neutral | Negative | null
  ) {
    if (category === undefined) category = null;
    const validEvents = events.filter(event => {
      if (event.type !== eventType || event.category !== category) {
        return false;
      }

      if (event.requirements === undefined) {
        return true;
      }

      const {
        health,
        hunger,
        stamina,
        weapon,
        armour,
        food
      } = event.requirements;

      if (health?.length) {
        if (!(member.health >= health[0] && member.health <= health[1])) {
          return false;
        }
      }

      if (hunger?.length) {
        if (!(member.hunger >= hunger[0] && member.hunger <= hunger[1])) {
          return false;
        }
      }

      if (stamina?.length) {
        if (!(member.stamina >= stamina[0] && member.stamina <= stamina[1])) {
          return false;
        }
      }

      if (weapon !== undefined) {
        if (!!member.weapon !== weapon) return false;
      }

      if (armour !== undefined) {
        if (!!member.armour !== armour) return false;
      }

      if (food?.length) {
        const foodPoints = HungerGames.getFoodPoints(member);
        if (!(foodPoints >= food[0] && foodPoints <= food[1])) {
          return false;
        }
      }

      return true;
    });

    return await randomElement(validEvents);
  }

  private async getRandomItem(items: IItem[], type: ItemType) {
    const validItems = items.filter(i => i.type === type);
    return await randomElement(validItems);
  }
}

export default HungerGames;
