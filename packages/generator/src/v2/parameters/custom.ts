import { kReplyParam, kRequestParam } from '../constants';
import type { BaseParameter, BaseProvider } from '../models';
import { format } from '../util/generation';
import { joinParameters } from '../util/syntax';

export class CustomParameter implements BaseParameter {
  value: string;
  helper?: string | undefined;
  imports?: string[] | undefined;
  providerName?: string;

  constructor(
    readonly index: number,
    readonly provider: BaseProvider,
    readonly helperParams: string[] | undefined,
    readonly schemaTransformer: boolean
  ) {
    this.providerName = `Resolver${index}`;
    this.value = `param${index}`;

    this.imports = [format(/* ts */ `import ${this.providerName} from "${provider.providerPath}";`)];

    this.helper = format(/* ts */ `
      ${joinParameters(provider.parameters)}

      const ${this.value} = await ${this.providerName}(${kRequestParam}, ${kReplyParam}${provider.parameters
      .map((p) => p.value)
      .join(',')});
    `);
  }
}
