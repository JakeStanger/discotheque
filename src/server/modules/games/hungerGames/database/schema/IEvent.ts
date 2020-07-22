import mongoose, { Document } from 'mongoose';
import EventType from '../../events/EventType';
import Positive from '../../events/Positive';
import Neutral from '../../events/Neutral';
import Negative from '../../events/Negative';

type MinMax = [number, number];

interface IEvent {
  _id: Readonly<number>;
  description: string;
  type: EventType;
  category?: Positive | Neutral | Negative;
  statChanges?: {
    health?: MinMax;
    hunger?: MinMax;
    stamina?: MinMax;
  };
  requirements?: {
    health?: MinMax;
    hunger?: MinMax;
    stamina?: MinMax;

    weapon?: boolean;
    armour?: boolean;
    food?: MinMax;
  };
}

const eventSchema = new mongoose.Schema<IEvent>({
  description: { type: String, required: true },
  type: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    required: true,
    index: true
  },
  category: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    index: true
  },
  statChanges: {
    health: [Number],
    hunger: [Number],
    stamina: [Number]
  },
  requirements: {
    health: [Number],
    hunger: [Number],
    stamina: [Number],

    weapon: Boolean,
    armour: Boolean,
    food: [Number]
  }
});

export const HungerGamesEvent = mongoose.model<IEvent & Document>(
  'HungerGamesEvent',
  eventSchema
);

export default IEvent;
