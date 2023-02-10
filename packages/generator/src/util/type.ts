import {
  AliasType,
  AnnotatedType,
  ArrayType,
  BaseType,
  DefinitionType,
  EnumType,
  IntersectionType,
  LiteralType,
  OptionalType,
  PrimitiveType,
  ReferenceType,
  TupleType,
  UndefinedType,
  UnionType,
  VoidType
} from 'ts-json-schema-generator';

/**
 * Tries to resolve the provided type into a primitive type, if it is one.
 */
export function asPrimitiveType(type: BaseType): BaseType | undefined {
  if (
    type instanceof DefinitionType ||
    type instanceof ReferenceType ||
    type instanceof AliasType
  ) {
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

  if (
    type instanceof UnionType ||
    type instanceof IntersectionType ||
    type instanceof EnumType ||
    type instanceof TupleType
  ) {
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
