import Service from './Service';
import IItem from '../../../../server/modules/games/hungerGames/database/schema/IItem';

class ItemService extends Service<IItem> {
  constructor() {
    super('/item');
  }
}

export default ItemService;
