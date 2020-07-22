import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesItem } from '../../database/schema/IItem';

class UpdateItem extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-updateItem',
      method: 'PATCH',
      path: '/hungerGames/item/:id'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const item = await HungerGamesItem.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    await res.json(item);
  }
}

export default UpdateItem;
