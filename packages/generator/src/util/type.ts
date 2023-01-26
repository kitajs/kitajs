import {
  AnnotatedType,
  ArrayType,
  BaseType,
  DefinitionType,
  LiteralType,
  OptionalType,
  PrimitiveType,
  ReferenceType,
  UndefinedType,
  UnionType,
  VoidType
} from 'ts-json-schema-generator';

/**
 * Tries to resolve the provided type into a primitive type, if it is one.
 */
export function asPrimitiveType(type: BaseType): BaseType | undefined {
  if (type instanceof DefinitionType || type instanceof ReferenceType) {
    return asPrimitiveType(type.getType());
  }

  if (
    type instanceof PrimitiveType ||
    type instanceof UndefinedType ||
    type instanceof VoidType ||
    type instanceof LiteralType
  ) {
    return type;
  }

  if (type instanceof OptionalType || type instanceof AnnotatedType) {
    if (asPrimitiveType(type.getType())) {
      return type;
    }
  }

  if (type instanceof UnionType) {
    if (type.getTypes().every((t) => asPrimitiveType(t))) {
      return type;
    }
  }

  if (type instanceof ArrayType) {
    if (asPrimitiveType(type.getItem())) {
      return type;
    }
  }

  return undefined;
}
