import {
  AnnotatedNodeParser,
  ChainNodeParser,
  CircularReferenceNodeParser,
  DEFAULT_CONFIG,
  ExposeNodeParser,
  ExtendedAnnotationsReader,
  FormatterAugmentor,
  ParserAugmentor,
  SubNodeParser
} from 'ts-json-schema-generator';
import type ts from 'typescript';
import { DefinitionTypeFormatter } from './definition-type-formatter';
import { TypeLiteralNodeParser } from './type-literal-node-parser';
import { TypeReferenceNodeParser } from './type-reference-node-parser';

/**
 * Giant hack to include the type literal node parser into the chain.
 *
 * @see https://github.com/vega/ts-json-schema-generator/blob/be35510af8b7e5874b8fdf2e6eff712e179ec6ad/factory/parser.ts#L157-L163
 */
export function buildParserAugmentor(typeChecker: ts.TypeChecker): ParserAugmentor {
  function withExpose(nodeParser: SubNodeParser): SubNodeParser {
    return new ExposeNodeParser(
      typeChecker,
      nodeParser,
      DEFAULT_CONFIG.expose,
      DEFAULT_CONFIG.jsDoc
    );
  }

  function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
    const extraTags = new Set(DEFAULT_CONFIG.extraTags);

    /// Default config jsdoc is extended
    /// https://github.com/vega/ts-json-schema-generator/blob/be35510af8b7e5874b8fdf2e6eff712e179ec6ad/src/Config.ts#L21
    return new AnnotatedNodeParser(
      nodeParser,
      new ExtendedAnnotationsReader(typeChecker, extraTags)
    );
  }

  function withCircular(nodeParser: SubNodeParser): SubNodeParser {
    return new CircularReferenceNodeParser(nodeParser);
  }

  return (parser) => {
    const chainNodeParser = parser as ChainNodeParser;

    parser.addNodeParser(
      withCircular(
        withExpose(
          withJsDoc(
            new TypeLiteralNodeParser(
              withJsDoc(chainNodeParser),
              DEFAULT_CONFIG.additionalProperties
            )
          )
        )
      )
    );

    parser.addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser));
  };
}

export function buildFormatterAugmentor(): FormatterAugmentor {
  return (fmt, circularReferenceTypeFormatter) => {
    fmt.addTypeFormatter(
      new DefinitionTypeFormatter(
        circularReferenceTypeFormatter,
        DEFAULT_CONFIG.encodeRefs
      )
    );
  };
}
