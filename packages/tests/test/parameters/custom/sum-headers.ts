import type { CustomParameter, Rep, Req, RouteContext } from '@kitajs/runtime';

export type SumHeaders<
  ReturnType extends 'string' | 'number',
  HeaderAName extends string = string,
  HeaderBName extends string = string
> = CustomParameter<
  { value: ReturnType extends 'string' ? string : number },
  [ReturnType, HeaderAName, HeaderBName]
>;

export default function (
  this: RouteContext,
  { headers }: Req,
  _: Rep,
  returnType: 'string' | 'number',
  headerAName: string,
  headerBName: string
): SumHeaders<'string' | 'number'> {
  const headerA = headers[headerAName];
  const headerB = headers[headerBName];

  const sum = Number(headerA) + Number(headerB);

  return { value: returnType === 'string' ? String(sum) : sum };
}
