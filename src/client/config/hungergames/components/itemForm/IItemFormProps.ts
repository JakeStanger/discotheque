import ItemService from '../../services/ItemService';
import { RouteComponentProps, StaticContext } from 'react-router';

export interface IItemFormParms {
  id?: string;
}

interface IItemFormProps
  extends RouteComponentProps<IItemFormParms, StaticContext, any> {
  itemService: ItemService;
}

export default IItemFormProps;
