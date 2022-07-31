export function unquote(str: string) {
  return str.replace(/(?:"|')(.*?)(?:"|')/g, '$1');
}
