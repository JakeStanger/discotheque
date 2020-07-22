import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesItem } from '../../database/schema/IItem';

class GetItem extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-getItem',
      method: 'GET',
      path: '/hungerGames/item/:id'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const item = await HungerGamesItem.findOne({ _id: req.params.id });
    await res.json(item);
  }
}

export default GetItem;
