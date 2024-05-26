export function tst<const S extends (string | string[] | number | false | undefined | null)[]>(
  templateArray: TemplateStringsArray,
  ...substitutions: S
): string {
  let code = '';

  for (const part of templateArray) {
    code += part;

    const value = substitutions.shift();

    if (!value) {
      continue;
    }

    // Calculate the number of spaces to keep the indentation
    const spaces = part.length - part.trimEnd().length;

    code += Array.isArray(value) ? value.join(`${' '.repeat(spaces)}\n`) : value;
  }

  return code.trim();
}
