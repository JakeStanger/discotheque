import ClientManager from '../../manager/ClientManager';
import SecretsHelper from '../../helper/SecretsHelper';
import * as colors from '../../utils/logging/colors';

interface IAddParams {
  name: string;
  token: string;
}

async function add({ name, token }: IAddParams) {
  const secretsHelper = SecretsHelper.get();
  const tokenEncoded = secretsHelper.encrypt(token);

  const clientManager = ClientManager.get();
  await clientManager.add({ name, token: tokenEncoded });
  console.log(`Added new client ${colors.client(name)} to database`);
}

export default add;
