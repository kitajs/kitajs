import type { Definition } from 'ts-json-schema-generator/dist/src/Schema/Definition';
import type { SubTypeFormatter } from 'ts-json-schema-generator/dist/src/SubTypeFormatter';
import type { BaseType } from 'ts-json-schema-generator/dist/src/Type/BaseType';
import { DefinitionType } from 'ts-json-schema-generator/dist/src/Type/DefinitionType';
import type { TypeFormatter } from 'ts-json-schema-generator/dist/src/TypeFormatter';
import { uniqueArray } from 'ts-json-schema-generator/dist/src/Utils/uniqueArray';

export class DefinitionTypeFormatter implements SubTypeFormatter {
  public constructor(
    private childTypeFormatter: TypeFormatter,
    private encodeRefs: boolean
  ) {}

  public supportsType(type: DefinitionType): boolean {
    return type instanceof DefinitionType;
  }

  public getDefinition(type: DefinitionType): Definition {
    const ref = type.getName();

    // CHANGED HERE
    //
    // fastify does not uses #/definitions/ for references
    return { $ref: this.encodeRefs ? encodeURIComponent(ref) : ref };
  }

  public getChildren(type: DefinitionType): BaseType[] {
    return uniqueArray([type, ...this.childTypeFormatter.getChildren(type.getType())]);
  }
}
