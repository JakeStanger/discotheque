import mongoose, { Document } from 'mongoose';
import ItemType from '../../items/ItemType';

interface IItem {
  _id: number;
  name: string;
  type: ItemType;
  strength: number;
}

const eventSchema = new mongoose.Schema<IItem>({
  name: { type: String, required: true },
  type: {
    type: Number,
    enum: [0, 1, 2],
    required: true,
    index: true
  },
  strength: Number
});

export const HungerGamesItem = mongoose.model<IItem & Document>(
  'HungerGamesItem',
  eventSchema
);

export default IItem;
