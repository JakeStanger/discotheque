import Module from '../../utils/Module';
import module from '../../decorators/module';
import HungerGames from './hungerGames/HungerGames';
// import Events from './hungerGames/webPanel/_old/Events';
// import Items from './hungerGames/webPanel/_old/Items';
// import Item from './hungerGames/webPanel/_old/Item';
// import UpdateItem from './hungerGames/webPanel/_old/UpdateItem';
// import Event from './hungerGames/webPanel/_old/Event';
import HTTPServer from '../../http/HTTPServer';
import path from 'path';
import express from 'express';
import GetEvents from './hungerGames/api/event/GetEvents';
import GetItems from './hungerGames/api/item/GetItems';
import GetEvent from './hungerGames/api/event/GetEvent';
import GetItem from './hungerGames/api/item/GetItem';
import UpdateItem from './hungerGames/api/item/UpdateItem';
import DeleteItem from './hungerGames/api/item/DeleteItem';
import AddItem from './hungerGames/api/item/AddItem';
import UpdateEvent from './hungerGames/api/event/UpdateEvent';
import AddEvent from './hungerGames/api/event/AddEvent';
import DeleteEvent from './hungerGames/api/event/DeleteEvent';

@module
class Games extends Module {
  constructor() {
    super();
    this.addCommands([HungerGames]);
    this.addRoutes([
      GetEvents,
      GetEvent,
      AddEvent,
      UpdateEvent,
      DeleteEvent,
      GetItems,
      GetItem,
      AddItem,
      UpdateItem,
      DeleteItem
    ]);

    HTTPServer.get().addRoute(
      '/hungergames',
      'MIDDLEWARE',
      express.static(path.join(__dirname, 'hungerGames', 'webPanel'))
    );
  }

  getDescription(): string {
    return 'Various fun things.';
  }

  getIdentifier(): string {
    return 'games';
  }

  getLink(): string | undefined {
    return undefined;
  }

  getName(): string {
    return 'Games';
  }
}

export default Games;
