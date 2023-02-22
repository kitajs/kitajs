import type { FastifySchema } from 'fastify';
import type ts from 'typescript';
import { capitalize } from '../../util/string';
import type { BaseParameter } from '../base-parameter';
import { BaseRoute } from '../base-route';

export class RestRoute extends BaseRoute {
  controllerName: string;
  
  controllerPrettyPath: string;
  
  controllerPath: string;
  
  controllerMethod: string;
  
  parameters: BaseParameter[];
  
  url: string;
  
  method: string;
  
  options: string | object | undefined;


  schema: FastifySchema & {
    /**
     * The open api operation id.
     *
     * @example `createUsers`
     */
    operationId: string;
  };

  constructor(
    nodeName: string,
    url: string,
    controllerName: string,
    controllerPath: string,
    pos: ts.LineAndCharacter
  ) {
    super();

    this.controllerMethod = nodeName;
    this.method = nodeName.toUpperCase();
    this.controllerName = controllerName;
    this.schema = { operationId: `${controllerName}${capitalize(nodeName)}` };
    this.url = url;
    this.parameters = [];
    this.controllerPath = controllerPath;
    this.controllerPrettyPath = `${controllerPath}:${pos.line + 1}`;
  }

}
