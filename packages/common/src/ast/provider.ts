import { Parameter } from './parameter';

/** The AST definition for a kitajs provider. */
export interface Provider {
  /** The path to the provider route */
  providerPath: string;

  /** If this provider has a schema transformer attached to it */
  schemaTransformer: boolean;

  /**
   * The type of the provider
   *
   * @example MyCustomProvider
   */
  type: string;

  /** If this provider is async */
  async: boolean;

  /** All possible parameters for this route. */
  parameters: Parameter[];
}
