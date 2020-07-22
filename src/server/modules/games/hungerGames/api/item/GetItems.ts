import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesItem } from '../../database/schema/IItem';

class GetItems extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-getItems',
      method: 'GET',
      path: '/hungerGames/item'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const events = await HungerGamesItem.find();
    await res.json(events);
  }
}

export default GetItems;
