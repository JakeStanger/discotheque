interface ICommandDefinition {
  name: string;
  description: string;
  aliases?: string[];
  nsfw?: boolean;
  admin?: boolean;
}

export default ICommandDefinition;
