import { HTTPMethod } from '../http/HTTPServer';

interface IRouteDefinition {
  name: string;
  path: string | RegExp;
  method: HTTPMethod;
  nsfw?: boolean;
  admin?: boolean;
}

export default IRouteDefinition;
