// Positive
import increaseHealthLarge from '../events/positive/increaseHealthLarge.json';
import increaseHealthSmall from '../events/positive/increaseHealthSmall.json';
import increaseHungerLarge from '../events/positive/increaseHungerLarge.json';
import increaseHungerSmall from '../events/positive/increaseHungerSmall.json';
import increaseStaminaLarge from '../events/positive/increaseStaminaLarge.json';
import increaseStaminaSmall from '../events/positive/increaseStaminaSmall.json';
import findWeapon from '../events/positive/findWeapon.json';
import findArmour from '../events/positive/findArmour.json';
import findFood from '../events/positive/findFood.json';
// Neutral
import rest from '../events/neutral/rest.json';
import nothing from '../events/neutral/nothing.json';
// Negative
import decreaseHealthLarge from '../events/negative/decreaseHealthLarge.json';
import decreaseHealthSmall from '../events/negative/decreaseHealthSmall.json';
import decreaseHungerLarge from '../events/negative/decreaseHungerLarge.json';
import decreaseHungerSmall from '../events/negative/decreaseHungerSmall.json';
import decreaseStaminaLarge from '../events/negative/decreaseStaminaLarge.json';
import decreaseStaminaSmall from '../events/negative/decreaseStaminaSmall.json';
import loseWeapon from '../events/negative/loseWeapon.json';
import loseArmour from '../events/negative/loseArmour.json';
import loseFood from '../events/negative/loseFood.json';
// Encounters
import encounters from '../events/encounters/encounters.json';

import IEvent, { HungerGamesEvent } from './schema/IEvent';
import EventType from '../events/EventType';
import Positive from '../events/Positive';
import Negative from '../events/Negative';
import Neutral from '../events/Neutral';

async function writeEvent(
  event: IEvent,
  type: EventType,
  category?: Positive | Neutral | Negative
) {
  await HungerGamesEvent.updateOne(
    { description: event.description },
    {
      $set: {
        ...(event as IEvent),
        type,
        category
      }
    },
    { upsert: true }
  );
}

export async function ensureEvents() {
  for (const event of increaseHealthLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseHealthLarge
    );
  }

  for (const event of increaseHealthSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseHealthSmall
    );
  }

  for (const event of increaseHungerLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseHungerLarge
    );
  }

  for (const event of increaseHungerSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseHungerSmall
    );
  }

  for (const event of increaseStaminaLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseStaminaLarge
    );
  }

  for (const event of increaseStaminaSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Positive,
      Positive.IncreaseStaminaSmall
    );
  }

  for (const event of findWeapon) {
    await writeEvent(event as IEvent, EventType.Positive, Positive.FindWeapon);
  }

  for (const event of findArmour) {
    await writeEvent(event as IEvent, EventType.Positive, Positive.FindArmour);
  }

  for (const event of findFood) {
    await writeEvent(event as IEvent, EventType.Positive, Positive.FindFood);
  }

  for (const event of rest) {
    await writeEvent(event as IEvent, EventType.Neutral, Neutral.Rest);
  }

  for (const event of nothing) {
    await writeEvent(event as IEvent, EventType.Neutral, Neutral.Nothing);
  }

  for (const event of decreaseHealthLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseHealthLarge
    );
  }

  for (const event of decreaseHealthSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseHealthSmall
    );
  }

  for (const event of decreaseHungerLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseHungerLarge
    );
  }

  for (const event of decreaseHungerSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseHungerSmall
    );
  }

  for (const event of decreaseStaminaLarge) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseStaminaLarge
    );
  }

  for (const event of decreaseStaminaSmall) {
    await writeEvent(
      event as IEvent,
      EventType.Negative,
      Negative.DecreaseStaminaSmall
    );
  }

  for (const event of loseWeapon) {
    await writeEvent(event as IEvent, EventType.Negative, Negative.LoseWeapon);
  }

  for (const event of loseArmour) {
    await writeEvent(event as IEvent, EventType.Negative, Negative.LoseArmour);
  }

  for (const event of loseFood) {
    await writeEvent(event as IEvent, EventType.Negative, Negative.LoseFood);
  }

  for (const event of encounters) {
    await writeEvent(event as IEvent, EventType.Encounter);
  }
}
