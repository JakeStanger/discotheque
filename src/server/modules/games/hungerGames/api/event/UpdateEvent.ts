import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesEvent } from '../../database/schema/IEvent';

class UpdateEvent extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-updateEvent',
      method: 'PATCH',
      path: '/hungerGames/event/:id'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    const item = await HungerGamesEvent.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    await res.json(item);
  }
}

export default UpdateEvent;
