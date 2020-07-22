import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesItem } from '../../database/schema/IItem';

class AddItem extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-addItem',
      method: 'POST',
      path: '/hungerGames/item'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    try {
      const item = await HungerGamesItem.create(req.body);
      await res.json(item);
    } catch (e) {
      await res.status(500).json({ error: e.message });
    }
  }
}

export default AddItem;
