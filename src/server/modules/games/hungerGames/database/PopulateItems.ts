import weapons from '../items/weapons.json';
import armour from '../items/armour.json';
import food from '../items/food.json';
import IItem, { HungerGamesItem } from './schema/IItem';
import ItemType from '../items/ItemType';

async function writeItem(item: IItem, type: ItemType) {
  await HungerGamesItem.updateOne(
    { name: item.name },
    {
      $set: {
        ...(item as IItem),
        type
      }
    },
    { upsert: true }
  );
}

export async function ensureItems() {
  for (const item of weapons) {
    await writeItem(item as IItem, ItemType.Weapon);
  }

  for (const item of armour) {
    await writeItem(item as IItem, ItemType.Armour);
  }

  for (const item of food) {
    await writeItem(item as IItem, ItemType.Food);
  }
}
