import { RouteComponentProps, StaticContext } from 'react-router';
import EventService from '../../services/EventService';

export interface IEventFormParams {
  id?: string;
}

interface IEventFormProps
  extends RouteComponentProps<IEventFormParams, StaticContext, any> {
  eventService: EventService;
}

export default IEventFormProps;
