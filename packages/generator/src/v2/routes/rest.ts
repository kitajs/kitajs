import type ts from 'typescript';
import type { BaseParameter, BaseRoute } from '../bases';
import type { RouteSchema } from '../schema';

export class RestRoute implements BaseRoute {
  controllerName: string;
  controllerPrettyPath: string;
  controllerPath: string;
  controllerMethod: string;
  parameters: BaseParameter[];
  url: string;
  method: Uppercase<string>;
  options: string | object | undefined;
  schema: RouteSchema;

  constructor(
    nodeName: string,
    url: string,
    controllerName: string,
    controllerPath: string,
    pos: ts.LineAndCharacter
  ) {
    this.controllerMethod = nodeName;
    this.method = nodeName.toUpperCase() as Uppercase<string>;
    this.controllerName = controllerName;
    this.url = url;
    this.parameters = [];
    this.controllerPath = controllerPath;
    this.controllerPrettyPath = `${controllerPath}:${pos.line + 1}`;
    this.schema = { operationId: `${this.method.toLowerCase()}${this.controllerName}` };
  }
}
