import Route from '../../../../../utils/Route';
import IRouteDefinition from '../../../../../utils/IRouteDefinition';
import { Request, Response } from 'express';
import Module from '../../../../../utils/Module';
import { HungerGamesEvent } from '../../database/schema/IEvent';

class AddEvent extends Route {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): IRouteDefinition {
    return {
      name: 'hg-addEvent',
      method: 'POST',
      path: '/hungerGames/event'
    };
  }

  public async run(req: Request, res: Response): Promise<void> {
    try {
      const item = await HungerGamesEvent.create(req.body);
      await res.json(item);
    } catch (e) {
      await res.status(500).json({ error: e.message });
    }
  }
}

export default AddEvent;
