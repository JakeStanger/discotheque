import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesEvent } from '../../database/schema/IEvent';

class DeleteEvent extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-deleteItem',
      method: 'DELETE',
      path: '/hungerGames/event/:id'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const item = await HungerGamesEvent.deleteOne({ _id: req.params.id });
    await res.json(item);
  }
}

export default DeleteEvent;
